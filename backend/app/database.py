import os
from sqlmodel import SQLModel, create_engine, Session
from loguru import logger
from .config import settings

# データディレクトリの作成
os.makedirs(os.path.dirname(settings.DATABASE_URL.replace("sqlite:///", "")), exist_ok=True)

# データベースエンジン作成
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite用
)

def create_db_and_tables():
    """データベースとテーブルの作成"""
    try:
        SQLModel.metadata.create_all(engine)
        logger.info("データベースとテーブルの初期化完了")
    except Exception as e:
        logger.error(f"データベース初期化エラー: {e}")
        raise

def get_session():
    """DB接続セッションを取得"""
    with Session(engine) as session:
        yield session