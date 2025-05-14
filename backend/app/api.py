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
