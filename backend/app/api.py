from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, or_, func
from typing import List, Dict, Any, Optional
from datetime import date

from .database import get_session
from .models import Subsidy

# APIルーター
router = APIRouter()

@router.get("/subsidies", response_model=List[Dict[str, Any]])
async def get_subsidies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session)
):
    """補助金一覧を取得"""
    subsidies = db.exec(select(Subsidy).offset(skip).limit(limit)).all()
    return [subsidy.to_dict() for subsidy in subsidies]

@router.get("/subsidies/{subsidy_id}", response_model=Dict[str, Any])
async def get_subsidy(
    subsidy_id: int,
    db: Session = Depends(get_session)
):
    """特定の補助金情報を取得"""
    subsidy = db.get(Subsidy, subsidy_id)
    if not subsidy:
        raise HTTPException(status_code=404, detail="補助金が見つかりません")
    return subsidy.to_dict()

@router.get("/search", response_model=List[Dict[str, Any]])
async def search_subsidies(
    q: Optional[str] = Query(None, description="検索キーワード"),
    organization: Optional[str] = Query(None, description="交付団体"),
    target: Optional[str] = Query(None, description="対象者"),
    active_only: bool = Query(False, description="募集中のみ"),
    db: Session = Depends(get_session)
):
    """補助金検索API"""
    query = select(Subsidy)
    
    # キーワード検索
    if q:
        query = query.where(
            or_(
                Subsidy.title.contains(q),
                Subsidy.description.contains(q),
                Subsidy.keywords.contains(q)
            )
        )
    
    # 交付団体フィルター
    if organization:
        query = query.where(Subsidy.organization == organization)
    
    # 対象者フィルター
    if target:
        query = query.where(Subsidy.target.contains(target))
    
    # 募集中のみ
    if active_only:
        today = date.today()
        query = query.where(
            (Subsidy.application_end >= today) | 
            (Subsidy.application_end == None)
        )
    
    # 結果取得
    subsidies = db.exec(query).all()
    return [subsidy.to_dict() for subsidy in subsidies]

@router.get("/match", response_model=Dict[str, Any])
async def match_subsidies(
    business_type: Optional[str] = Query(None, description="業種"),
    prefecture: Optional[str] = Query(None, description="都道府県"),
    target_type: Optional[str] = Query(None, description="対象者タイプ"),
    keywords: str = Query("", description="キーワード（カンマ区切り）"),
    db: Session = Depends(get_session)
):
    """補助金マッチングAPI"""
    # 全補助金取得
    query = select(Subsidy)
    all_subsidies = db.exec(query).all()
    
    # マッチングスコア計算
    matched_subsidies = []
    
    # キーワードリスト作成
    keyword_list = [k.strip() for k in keywords.split(",") if k.strip()]
    
    for subsidy in all_subsidies:
        score = 0
        
        # 地域マッチング
        if prefecture and prefecture in subsidy.organization:
            score += 3
        
        # 対象者マッチング
        if target_type and target_type in subsidy.target:
            score += 5
        
        # 業種マッチング
        if business_type and business_type in subsidy.description:
            score += 3
        
        # キーワードマッチング
        for keyword in keyword_list:
            if keyword in subsidy.title:
                score += 2
            elif keyword in subsidy.description:
                score += 1
            elif keyword in subsidy.keywords:
                score += 1
        
        if score > 0:
            matched_subsidies.append({
                "subsidy": subsidy,
                "score": score
            })
    
    # スコア順にソート
    matched_subsidies.sort(key=lambda x: x["score"], reverse=True)
    
    # 返却
    return {
        "matches": [
            {
                "id": item["subsidy"].id,
                "title": item["subsidy"].title,
                "organization": item["subsidy"].organization,
                "score": item["score"],
                "url": item["subsidy"].url,
                "target": item["subsidy"].target,
                "is_active": item["subsidy"].is_active()
            }
            for item in matched_subsidies[:20]  # 上位20件
        ]
    }

@router.get("/stats", response_model=Dict[str, Any])
async def get_stats(
    db: Session = Depends(get_session)
):
    """補助金統計情報API"""
    # 総数
    total_count_query = select(func.count(Subsidy.id))
    total_count = db.exec(total_count_query).one()
    
    # 募集中の数
    today = date.today()
    active_count_query = select(func.count(Subsidy.id)).where(
        (Subsidy.application_end >= today) | 
        (Subsidy.application_end == None)
    )
    active_count = db.exec(active_count_query).one()
    
    # 交付団体別の数
    org_results = {}
    orgs = db.exec(select(Subsidy.organization).distinct()).all()
    for org in orgs:
        org_count_query = select(func.count(Subsidy.id)).where(Subsidy.organization == org)
        org_results[org] = db.exec(org_count_query).one()
    
    return {
        "total_count": total_count,
        "active_count": active_count,
        "organizations": org_results
    }
