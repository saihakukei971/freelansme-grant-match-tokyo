from datetime import datetime, date
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Subsidy(SQLModel, table=True):
    """補助金情報モデル"""
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    organization: str  # 交付団体（国・都道府県・市区町村）
    target: str  # 対象者
    amount: Optional[str] = None  # 補助金額/補助率
    application_start: Optional[date] = None
    application_end: Optional[date] = None
    url: str
    keywords: str = ""  # キーワード（カンマ区切り）
    source: str  # "jgrants" or "scraping"
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    def is_active(self) -> bool:
        """現在募集中かどうかを判定"""
        today = date.today()
        if self.application_end is None:
            return True
        return self.application_end >= today

    def to_dict(self):
        """辞書形式に変換"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "organization": self.organization,
            "target": self.target,
            "amount": self.amount,
            "application_start": self.application_start.isoformat() if self.application_start else None,
            "application_end": self.application_end.isoformat() if self.application_end else None,
            "url": self.url,
            "keywords": self.keywords,
            "source": self.source,
            "is_active": self.is_active(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }