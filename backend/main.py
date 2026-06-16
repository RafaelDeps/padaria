from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth_routes, product_routes, movement_routes, dashboard_routes
from api.errors import validation_exception_handler, generic_exception_handler
from fastapi.exceptions import RequestValidationError
from models.base import Base
from models.database import engine
from models.user import User
from models.product import Product
from models.movement import Movement

app = FastAPI(title="Padaria Inventory Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(auth_routes.router, prefix="/api")
app.include_router(product_routes.router, prefix="/api")
app.include_router(movement_routes.router, prefix="/api")
app.include_router(dashboard_routes.router, prefix="/api")

@app.on_event("startup")
def startup_create_tables():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to Padaria Inventory Management API"}
