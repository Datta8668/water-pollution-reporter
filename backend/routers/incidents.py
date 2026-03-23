from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from models.database import get_db
from models.models import Incident
from schemas.incident import IncidentCreate, IncidentOut, IncidentUpdate
from routers.auth import get_current_user


# Router
router = APIRouter(prefix="/incidents", tags=["Incidents"])


# 🔹 1. POST /incidents/report (Citizen only)
@router.post("/report", response_model=IncidentOut)
def report_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    # Only citizen can report
    if current_user.role != "citizen":
        raise HTTPException(status_code=403, detail="Only citizens can report incidents")

    # Create new incident
    new_incident = Incident(
        user_id=current_user.id,
        title=incident.title,
        description=incident.description,
        latitude=incident.latitude,
        longitude=incident.longitude,
        address=incident.address,
        photo_url=incident.photo_url,
        pollution_type="unknown",   # ML later
        severity="low",             # ML later
        status="pending"
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return new_incident


# 🔹 2. GET /incidents/map (Public)
@router.get("/map")
def get_map_data(db: Session = Depends(get_db)):

    incidents = db.query(Incident).all()

    return [
        {
            "id": i.id,
            "latitude": i.latitude,
            "longitude": i.longitude,
            "status": i.status,
            "severity": i.severity,
            "pollution_type": i.pollution_type
        }
        for i in incidents
    ]


# 🔹 3. GET /incidents/my (Citizen)
@router.get("/my", response_model=list[IncidentOut])
def my_incidents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return db.query(Incident).filter(Incident.user_id == current_user.id).all()


# 🔹 4. GET /incidents/{id}
@router.get("/{id}", response_model=IncidentOut)
def get_incident(
    id: int,
    db: Session = Depends(get_db)
):

    incident = db.query(Incident).filter(Incident.id == id).first()

    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    return incident


# 🔹 5. PATCH /incidents/{id}/status (Officer/Admin)
@router.patch("/{id}/status", response_model=IncidentOut)
def update_status(
    id: int,
    data: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    # Only officer/admin allowed
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    incident = db.query(Incident).filter(Incident.id == id).first()

    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    # Update fields
    if data.status:
        incident.status = data.status

    if data.assigned_officer_id:
        incident.assigned_officer_id = data.assigned_officer_id

    # If resolved → set time
    if data.status == "resolved":
        incident.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(incident)

    return incident
