import os
import sys
# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from models.database import SessionLocal
from models.user import User
from auth.jwt_utils import get_password_hash

def seed():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                nome="Administrador",
                username="admin",
                senha_hash=get_password_hash("admin123"),
                cargo="GERENTE"
            )
            db.add(admin)
            
            # Add an attendant for testing
            attendant = User(
                nome="Atendente Teste",
                username="atendente",
                senha_hash=get_password_hash("atendente123"),
                cargo="ATENDENTE"
            )
            db.add(attendant)
            
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
