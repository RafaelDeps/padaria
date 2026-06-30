from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.database import get_db
from controllers import product_controller
from auth.middleware import manager_only, all_roles
from pydantic import BaseModel, condecimal
from datetime import date

router = APIRouter(prefix="/produtos", tags=["Products"])

class ProductBase(BaseModel):
    nome: str
    categoria: str
    estoque_minimo: int
    preco_unitario: float
    data_validade: date

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    quantidade_atual: int
    is_ativo: bool

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ProductResponse])
def read_products(stagnant: bool = False, db: Session = Depends(get_db), user=Depends(all_roles)):
    return product_controller.get_products(db, active_only=not stagnant, stagnant=stagnant)

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db), user=Depends(manager_only)):
    return product_controller.create_product(db, product.dict())

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db), user=Depends(manager_only)):
    return product_controller.update_product(db, product_id, product.dict())

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), user=Depends(manager_only)):
    return product_controller.delete_product(db, product_id)
