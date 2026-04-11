# 💧 Water Pollution Incident Reporting & Prediction System

A full-stack civic technology platform for real-time water 
pollution reporting, AI classification, and government response tracking.

## Tech Stack
- **Frontend:** Next.js 16, Tailwind CSS, Leaflet.js, Recharts
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy, JWT Auth
- **ML Service:** TensorFlow, scikit-learn, XGBoost (Phase 4)
- **Storage:** Cloudinary (images), Supabase (database)

## Features
- ✅ Citizen pollution incident reporting with GPS + photo upload
- ✅ AI-based pollution type classification (Phase 4)
- ✅ Government officer dashboard with map and analytics
- ✅ Role-based access control (Citizen / Officer / Admin)
- ✅ Real-time incident status tracking with notifications

## Project Structure
- /frontend → Next.js application
- /backend  → FastAPI REST API
- /ml-service → ML classification microservice

## Setup Instructions

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Status
- Phase 1 ✅ Project Setup
- Phase 2 ✅ Backend API
- Phase 3 ✅ Frontend
- Phase 4 🔄 ML Models (In Progress)
