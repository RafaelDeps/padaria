from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.movement import Movement
from models.product import Product

def get_movements(db: Session, limit: int = 50):
    return db.query(Movement).order_by(Movement.data_hora.desc()).limit(limit).all()

def create_movement(db: Session, movement_data: dict, user_id: int):
    product = db.query(Product).filter(Product.id == movement_data['produto_id']).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if movement_data['tipo'] == 'SAIDA':
        if product.quantidade_atual < movement_data['quantidade']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Estoque insuficiente para esta operação."
            )
        product.quantidade_atual -= movement_data['quantidade']
    else:
        product.quantidade_atual += movement_data['quantidade']

    db_movement = Movement(**movement_data, usuario_id=user_id)
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement
