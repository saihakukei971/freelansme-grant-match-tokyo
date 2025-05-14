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
        result = await update_all_subsidies()
        logger.info(f"初期データの取得完了: {result}")
    except Exception as e:
        logger.error(f"初期データの取得に失敗: {e}")

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
# Renderでは相対パスでなく絶対パスを使用
static_dir = "./frontend/dist"
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    logger.warning(f"静的ファイルディレクトリが見つかりません: {static_dir}")

# ルートエンドポイント
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
