import os
import sys
# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from models.database import SessionLocal
from models.base import Base
from models.database import engine
from models.user import User
from models.product import Product
from models.movement import Movement
from auth.jwt_utils import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                nome="Administrador",
                username="admin",
                senha_hash=get_password_hash("admin123"),
                cargo="gerente"
            )
            db.add(admin)
            
            # Add a funcionario for testing
            funcionario = User(
                nome="Funcionário Teste",
                username="funcionario",
                senha_hash=get_password_hash("funcionario123"),
                cargo="funcionario"
            )
            db.add(funcionario)
            
            db.commit()
            print("Database seeded successfully!")
        else:
            print("Admin user already exists.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
