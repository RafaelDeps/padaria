from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import get_db
from controllers import dashboard_controller
from auth.middleware import manager_only

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def read_stats(db: Session = Depends(get_db), user=Depends(manager_only)):
    return dashboard_controller.get_stats(db)
