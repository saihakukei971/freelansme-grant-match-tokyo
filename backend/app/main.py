from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import asyncio
from loguru import logger
import os
from sqlalchemy.sql import func

from .api import router as api_router
from .config import settings
from .database import create_db_and_tables
from .data_sources import update_all_subsidies

# ロガー設定
logger.add(
    "logs/app.log", 
    rotation="10 MB", 
    level=settings.LOG_LEVEL, 
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)

# FastAPIアプリケーション作成
app = FastAPI(
    title="補助金ファインダー",
    description="補助金検索・マッチングAPI",
    version="1.0.0",
)

# CORSミドルウェア追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に制限する
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーターを追加
app.include_router(api_router, prefix="/api")

# データ初期化と定期更新
async def init_data():
    """初期データの取得"""
    logger.info("初期データの取得を開始")
    try:
        # 本番環境ではデータ取得を試みるが、失敗してもサンプルデータを用意
        try:
            result = await update_all_subsidies()
            logger.info(f"初期データの取得完了: {result}")
        except Exception as e:
            logger.error(f"APIからのデータ取得に失敗: {e}")
            # サンプルデータの作成
            await create_sample_data()
    except Exception as e:
        logger.error(f"初期データの取得に失敗: {e}")

# サンプルデータ作成（デモ用）
async def create_sample_data():
    """サンプルデータの作成（APIが利用できない場合）"""
    from datetime import datetime, date, timedelta
    from sqlmodel import Session
    from .models import Subsidy
    from .database import engine
    
    # サンプルデータ
    sample_data = [
        {
            "title": "創業補助金（サンプル）",
            "description": "これはサンプルデータです。実際の補助金ではありません。新たに創業する中小企業を支援するための補助金です。",
            "organization": "国",
            "target": "中小企業,個人事業主",
            "amount": "最大200万円（補助率2/3）",
            "application_start": date.today() - timedelta(days=30),
            "application_end": date.today() + timedelta(days=60),
            "url": "https://www.jgrants-portal.go.jp/",
            "keywords": "創業,スタートアップ,ベンチャー",
            "source": "jgrants"
        },
        {
            "title": "DX推進補助金（サンプル）",
            "description": "これはサンプルデータです。実際の補助金ではありません。中小企業のデジタルトランスフォーメーションを推進するための補助金です。",
            "organization": "国",
            "target": "中小企業",
            "amount": "最大300万円（補助率1/2）",
            "application_start": date.today() - timedelta(days=15),
            "application_end": date.today() + timedelta(days=45),
            "url": "https://www.jgrants-portal.go.jp/",
            "keywords": "DX,デジタル化,IT",
            "source": "jgrants"
        },
        {
            "title": "東京都商店街活性化事業（サンプル）",
            "description": "これはサンプルデータです。実際の補助金ではありません。東京都内の商店街の活性化を図るための補助金です。",
            "organization": "東京都",
            "target": "商店街,中小企業",
            "amount": "最大500万円（補助率3/4）",
            "application_start": date.today() - timedelta(days=5),
            "application_end": date.today() + timedelta(days=25),
            "url": "https://www.metro.tokyo.lg.jp/",
            "keywords": "商店街,地域活性化",
            "source": "scraping"
        },
        {
            "title": "東京都ものづくり企業支援（サンプル）",
            "description": "これはサンプルデータです。実際の補助金ではありません。東京都内のものづくり企業の技術革新を支援するための補助金です。",
            "organization": "東京都",
            "target": "中小企業,製造業",
            "amount": "最大1000万円（補助率2/3）",
            "application_start": date.today() - timedelta(days=60),
            "application_end": date.today() + timedelta(days=30),
            "url": "https://www.metro.tokyo.lg.jp/",
            "keywords": "ものづくり,技術革新,製造業",
            "source": "scraping"
        },
        {
            "title": "フリーランス支援金（サンプル）",
            "description": "これはサンプルデータです。実際の補助金ではありません。フリーランスや個人事業主のスキルアップや事業拡大を支援するための補助金です。",
            "organization": "国",
            "target": "個人事業主,フリーランス",
            "amount": "最大50万円（定額）",
            "application_start": date.today() - timedelta(days=10),
            "application_end": date.today() + timedelta(days=80),
            "url": "https://www.jgrants-portal.go.jp/",
            "keywords": "フリーランス,個人事業主,スキルアップ",
            "source": "jgrants"
        }
    ]
    
    with Session(engine) as session:
        # 既存データの確認
        existing_count = session.exec(func.count(Subsidy.id)).one()
        
        if existing_count == 0:
            logger.info(f"サンプルデータを作成します（{len(sample_data)}件）")
            
            # サンプルデータの挿入
            for item in sample_data:
                subsidy = Subsidy(**item, created_at=datetime.now(), updated_at=datetime.now())
                session.add(subsidy)
            
            # コミット
            session.commit()
            logger.info(f"サンプルデータの作成完了: {len(sample_data)}件")
        else:
            logger.info(f"既存データが存在するため、サンプルデータは作成しません: {existing_count}件")

# バックグラウンドタスク
async def scheduled_update():
    """定期的なデータ更新タスク"""
    while True:
        try:
            await asyncio.sleep(settings.SCRAPE_INTERVAL_HOURS * 3600)  # 時間をsecに変換
            logger.info("定期データ更新を開始")
            result = await update_all_subsidies()
            logger.info(f"定期データ更新完了: {result}")
        except Exception as e:
            logger.error(f"定期データ更新に失敗: {e}")
            await asyncio.sleep(60)  # エラー時は1分後に再試行

# 起動時の処理
@app.on_event("startup")
async def startup_event():
    """アプリケーション起動時の処理"""
    logger.info("アプリケーション起動")
    
    # データベース初期化
    create_db_and_tables()
    
    # 初期データの取得
    asyncio.create_task(init_data())
    
    # 定期更新タスクの開始
    if settings.APP_ENV == "production":
        asyncio.create_task(scheduled_update())

# 静的ファイル配信（ビルド済みフロントエンド）
paths_to_try = [
    "/opt/render/project/src/frontend/dist",
    "./frontend/dist",
    "../frontend/dist",
    "./static"
]

static_path = None
for path in paths_to_try:
    if os.path.exists(path):
        logger.info(f"静的ファイルディレクトリを発見: {path}")
        static_path = path
        break
    else:
        logger.debug(f"静的ファイルディレクトリが見つかりません: {path}")

if static_path:
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")
else:
    logger.warning("静的ファイルディレクトリが見つかりません。APIのみが利用可能です。")
    
    @app.get("/")
    def root():
        return {"message": "補助金ファインダー API - フロントエンド配信に問題があります"}

# APIエンドポイント
@app.get("/api")
def read_root():
    """APIルートエンドポイント"""
    return {
        "message": "補助金ファインダー API",
        "version": "1.0.0",
        "environment": settings.APP_ENV
    }

# ヘルスチェックエンドポイント
@app.get("/api/health")
def health_check():
    """ヘルスチェック"""
    return {"status": "ok"}

@app.get("/api/update", include_in_schema=False)
async def trigger_update(background_tasks: BackgroundTasks):
    """手動更新トリガー（開発用）"""
    if settings.APP_ENV != "production":
        background_tasks.add_task(update_all_subsidies)
        return {"message": "データ更新を開始しました"}
    return {"message": "本番環境では手動更新は無効化されています"}

# サンプルデータ生成エンドポイント（開発用）
@app.get("/api/generate-samples", include_in_schema=False)
async def generate_samples(background_tasks: BackgroundTasks):
    """サンプルデータ生成（開発用）"""
    background_tasks.add_task(create_sample_data)
    return {"message": "サンプルデータの生成を開始しました"}
