from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.product import Product

from datetime import datetime, timedelta
from sqlalchemy import func
from models.movement import Movement

def get_stagnant_products(db: Session, days: int = 30):
    # Products with no movements in the last X days
    recent_movements = db.query(Movement.produto_id).filter(
        Movement.data_hora >= datetime.now() - timedelta(days=days)
    ).distinct().all()
    recent_ids = [m[0] for m in recent_movements]
    return db.query(Product).filter(
        Product.is_ativo == True,
        ~Product.id.in_(recent_ids)
    ).all()

def get_products(db: Session, active_only: bool = True, stagnant: bool = False):
    if stagnant:
        return get_stagnant_products(db)
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_ativo == True)
    return query.all()

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def create_product(db: Session, product_data: dict):
    db_product = Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_data: dict):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.is_ativo = False # Soft delete
    db.commit()
    return {"message": "Product deleted (soft delete)"}
