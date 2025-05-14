import httpx
import asyncio
from bs4 import BeautifulSoup
from datetime import datetime, date
from loguru import logger
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select
import dateutil.parser

from .config import settings
from .models import Subsidy
from .database import engine

async def fetch_jgrants_data() -> Optional[List[Dict[str, Any]]]:
    """jGrants APIからデータ取得"""
    url = settings.JGRANTS_API_URL

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers={"Accept": "application/json"})

            if response.status_code == 200:
                data = response.json()
                logger.info(f"jGrants APIから{len(data.get('data', []))}件の補助金情報を取得")
                return data.get("data", [])
            else:
                logger.error(f"jGrants API エラー: {response.status_code}")
                return None
    except Exception as e:
        logger.error(f"jGrants API 取得エラー: {e}")
        return None

def parse_date(date_str: Optional[str]) -> Optional[date]:
    """日付文字列をパース"""
    if not date_str:
        return None
    try:
        return dateutil.parser.parse(date_str).date()
    except (ValueError, TypeError):
        return None

async def update_jgrants_subsidies() -> int:
    """jGrantsデータ取得・DB更新"""
    data = await fetch_jgrants_data()
    if not data:
        logger.warning("更新するデータがありません")
        return 0

    updated_count = 0
    added_count = 0

    with Session(engine) as session:
        for item in data:
            # 既存データ確認
            subsidy = session.exec(select(Subsidy).where(
                Subsidy.source == "jgrants",
                Subsidy.url == item.get("url", "")
            )).first()

            # 基本データ準備
            subsidy_data = {
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "organization": item.get("organization", "国"),
                "target": item.get("target", ""),
                "amount": item.get("amount", ""),
                "application_start": parse_date(item.get("application_start")),
                "application_end": parse_date(item.get("application_end")),
                "url": item.get("url", ""),
                "keywords": ",".join(item.get("keywords", [])) if isinstance(item.get("keywords", []), list) else item.get("keywords", ""),
                "source": "jgrants",
                "updated_at": datetime.now()
            }

            if subsidy:
                # 既存レコード更新
                for key, value in subsidy_data.items():
                    setattr(subsidy, key, value)
                updated_count += 1
            else:
                # 新規レコード作成
                new_subsidy = Subsidy(**subsidy_data)
                session.add(new_subsidy)
                added_count += 1

        # コミット
        session.commit()

    logger.info(f"jGrants更新完了: {added_count}件追加, {updated_count}件更新")
    return added_count + updated_count

async def scrape_tokyo_subsidies() -> List[Dict[str, Any]]:
    """東京都の補助金ページをスクレイピング"""
    url = settings.TOKYO_SUBSIDY_URL
    subsidies = []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'lxml')

            # セレクタは実際のサイト構造に合わせて調整が必要
            # ここでは一般的なセレクタを例として使用
            subsidy_items = soup.select('.subsidy-item, .content-box, article, .list-item')

            for item in subsidy_items:
                # タイトル要素を探す（複数のパターンを試す）
                title_elem = (
                    item.select_one('h3, h2, .title, .heading') or
                    item.select_one('a[href*="subsidy"], a[href*="josei"]') or
                    item.select_one('a')
                )

                # 説明文を探す
                desc_elem = item.select_one('p, .description, .summary')

                # リンク要素を探す
                link_elem = item.select_one('a')

                if title_elem and link_elem:
                    title_text = title_elem.get_text(strip=True)

                    # リンクのhref属性を取得
                    href = link_elem.get('href', '')

                    # 相対URLを絶対URLに変換
                    if href and not href.startswith(('http://', 'https://')):
                        href = f"{url.rstrip('/')}/{href.lstrip('/')}"

                    # 説明文を取得
                    description = desc_elem.get_text(strip=True) if desc_elem else ""

                    subsidy = {
                        "title": title_text,
                        "description": description,
                        "organization": "東京都",
                        "target": "中小企業等",  # 詳細ページから取得するとよい
                        "url": href,
                        "source": "scraping"
                    }
                    subsidies.append(subsidy)

            logger.info(f"東京都から{len(subsidies)}件の補助金情報を取得")
            return subsidies

    except Exception as e:
        logger.error(f"東京都スクレイピングエラー: {e}")
        return []

async def update_tokyo_subsidies() -> int:
    """東京都補助金データ取得・DB更新"""
    subsidies = await scrape_tokyo_subsidies()
    if not subsidies:
        logger.warning("更新するデータがありません")
        return 0

    added_count = 0
    updated_count = 0

    with Session(engine) as session:
        for item in subsidies:
            # 既存データ確認
            subsidy = session.exec(select(Subsidy).where(
                Subsidy.source == "scraping",
                Subsidy.url == item["url"]
            )).first()

            if subsidy:
                # 既存レコード更新
                for key, value in item.items():
                    setattr(subsidy, key, value)
                setattr(subsidy, "updated_at", datetime.now())
                updated_count += 1
            else:
                # 新規レコード作成
                new_subsidy = Subsidy(**item, created_at=datetime.now(), updated_at=datetime.now())
                session.add(new_subsidy)
                added_count += 1

        # コミット
        session.commit()

    logger.info(f"東京都補助金更新完了: {added_count}件追加, {updated_count}件更新")
    return added_count + updated_count

# 全データソースの更新を一括実行
async def update_all_subsidies() -> Dict[str, int]:
    """全データソースの補助金情報を更新"""
    jgrants_count = await update_jgrants_subsidies()
    tokyo_count = await update_tokyo_subsidies()

    return {
        "jgrants": jgrants_count,
        "tokyo": tokyo_count,
        "total": jgrants_count + tokyo_count
    }