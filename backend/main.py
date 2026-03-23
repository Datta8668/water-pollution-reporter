from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database
from models.database import engine, Base
from models import models

# Import routers
from routers import auth, incidents, zones


# Create app
app = FastAPI()


# 🔹 Create database tables
Base.metadata.create_all(bind=engine)


# 🔹 CORS (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔹 Include routers
app.include_router(auth.router)
app.include_router(incidents.router)
app.include_router(zones.router)


# 🔹 Test route
@app.get("/")
def root():
    return {"message": "Water Pollution API Running"}
