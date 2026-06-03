from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.database import get_db
from controllers import movement_controller
from auth.middleware import all_roles
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/movimentacoes", tags=["Movements"])

class MovementBase(BaseModel):
    produto_id: int
    tipo: str # 'ENTRADA' or 'SAIDA'
    quantidade: int
    observacao: str = None

class MovementCreate(MovementBase):
    pass

class MovementResponse(MovementBase):
    id: int
    usuario_id: int
    data_hora: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[MovementResponse])
def read_movements(db: Session = Depends(get_db), user=Depends(all_roles)):
    return movement_controller.get_movements(db)

@router.post("/", response_model=MovementResponse)
def create_movement(movement: MovementCreate, db: Session = Depends(get_db), user=Depends(all_roles)):
    return movement_controller.create_movement(db, movement.dict(), user['id'])
