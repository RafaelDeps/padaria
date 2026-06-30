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
    # Check for duplicate name
    existing = db.query(Product).filter(Product.nome == product_data.get('nome')).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ja existe um produto com este nome",
        )

    db_product = Product(**product_data)
    if db_product.data_validade and db_product.data_validade < datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A data de validade nao pode estar no passado",
        )
    if db_product.preco_unitario <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O preco unitario deve ser maior que zero",
        )
    if db_product.estoque_minimo < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O estoque minimo nao pode ser negativo",
        )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_data: dict):
    db_product = get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check for duplicate name (excluding current product)
    if 'nome' in product_data:
        existing = db.query(Product).filter(
            Product.nome == product_data['nome'],
            Product.id != product_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ja existe um produto com este nome",
            )

    for key, value in product_data.items():
        setattr(db_product, key, value)
    if db_product.data_validade and db_product.data_validade < datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A data de validade nao pode estar no passado",
        )
    if db_product.preco_unitario <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O preco unitario deve ser maior que zero",
        )
    if db_product.estoque_minimo < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O estoque minimo nao pode ser negativo",
        )
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

