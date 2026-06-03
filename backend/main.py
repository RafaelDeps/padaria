from fastapi import FastAPI
from api import auth_routes, product_routes, movement_routes, dashboard_routes
from api.errors import validation_exception_handler, generic_exception_handler
from fastapi.exceptions import RequestValidationError

app = FastAPI(title="Padaria Inventory Management API")

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(auth_routes.router, prefix="/api")
app.include_router(product_routes.router, prefix="/api")
app.include_router(movement_routes.router, prefix="/api")
app.include_router(dashboard_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Padaria Inventory Management API"}
