from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.database import get_db
from models.models import Zone, Incident
from schemas.zone import ZoneOut
from routers.auth import get_current_user


# Router
router = APIRouter(prefix="/zones", tags=["Zones"])


# 🔹 1. GET /zones/ (Public)
@router.get("/", response_model=list[ZoneOut])
def get_zones(db: Session = Depends(get_db)):

    zones = db.query(Zone).all()
    return zones


# 🔹 2. GET /zones/{id}/incidents (Officer only)
@router.get("/{id}/incidents")
def get_zone_incidents(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    # Only officer allowed
    if current_user.role != "officer":
        raise HTTPException(status_code=403, detail="Only officers allowed")

    # For now → simple logic (can improve later)
    incidents = db.query(Incident).all()

    return incidents
