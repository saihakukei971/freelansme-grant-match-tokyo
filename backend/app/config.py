import os
from typing import Optional
from pydantic import BaseSettings
from dotenv import load_dotenv

# .envファイルを読み込む
load_dotenv()

class Settings(BaseSettings):
    """アプリケーション設定"""

    # アプリケーション設定
    APP_NAME: str = "補助金ファインダー"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # データベース
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///../../data/subsidies.db")

    # jGrants API
    JGRANTS_API_URL: str = os.getenv(
        "JGRANTS_API_URL",
        "https://api.jgrants-portal.go.jp/v2/subsidy"
    )

    # スクレイピング設定
    TOKYO_SUBSIDY_URL: str = os.getenv(
        "TOKYO_SUBSIDY_URL",
        "https://www.sangyo-rodo.metro.tokyo.lg.jp/chushou/shoko/sougyou/josei/"
    )
    SCRAPE_INTERVAL_HOURS: int = int(os.getenv("SCRAPE_INTERVAL_HOURS", "24"))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# シングルトンインスタンス
settings = Settings()