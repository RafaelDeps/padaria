import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.base import Base
from models.product import Product
from models.user import User
from models.movement import Movement
from controllers.movement_controller import create_movement
from fastapi import HTTPException

# Setup in-memory SQLite for testing
engine = create_engine("sqlite:///:memory:")
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

from datetime import date

def test_negative_stock_blocked(db):
    # Create a product with 10 units
    product = Product(
        nome="Teste", categoria="Cat", quantidade_atual=10, 
        estoque_minimo=5, preco_unitario=1.0, data_validade=date(2026, 12, 31)
    )
    db.add(product)
    db.commit()

    # Attempt to remove 15 units (should fail)
    movement_data = {"produto_id": product.id, "tipo": "SAIDA", "quantidade": 15}
    with pytest.raises(HTTPException) as exc:
        create_movement(db, movement_data, user_id=1)
    
    assert exc.value.status_code == 400
    assert "Estoque insuficiente" in exc.value.detail

def test_positive_movement_allowed(db):
    product = Product(
        nome="Teste", categoria="Cat", quantidade_atual=10, 
        estoque_minimo=5, preco_unitario=1.0, data_validade=date(2026, 12, 31)
    )
    db.add(product)
    db.commit()

    movement_data = {"produto_id": product.id, "tipo": "SAIDA", "quantidade": 5}
    create_movement(db, movement_data, user_id=1)
    
    db.refresh(product)
    assert product.quantidade_atual == 5
