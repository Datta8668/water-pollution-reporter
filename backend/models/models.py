from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from .database import Base



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())




class Zone(Base):
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    city = Column(String)
    state = Column(String)
    risk_score = Column(Float)
    last_updated = Column(DateTime)




class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)

    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String)

    photo_url = Column(String)

    pollution_type = Column(String)
    severity = Column(String)
    status = Column(String)

    ai_confidence = Column(Float)

    assigned_officer_id = Column(Integer, ForeignKey("users.id"))

    created_at = Column(DateTime, server_default=func.now())
    resolved_at = Column(DateTime)




class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True)

    zone_id = Column(Integer, ForeignKey("zones.id"))
    predicted_risk_level = Column(String)

    prediction_date = Column(DateTime)
    weather_snapshot = Column(Text)

    created_at = Column(DateTime, server_default=func.now())




class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    incident_id = Column(Integer, ForeignKey("incidents.id"))

    message = Column(String)
    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime, server_default=func.now())
