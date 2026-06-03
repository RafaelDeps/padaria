# Quickstart: Inventory Management RBAC

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

## Backend Setup
1. Navigate to `backend/`.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Windows).
4. Install dependencies: `pip install fastapi uvicorn sqlalchemy alembic pyjwt psycopg2-binary`.
5. Run migrations: `alembic upgrade head`.
6. Start server: `uvicorn main:app --reload`.

## Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start development server: `npm start`.

## Initial Data
A script will be provided in `backend/scripts/seed.py` to create the initial `admin` user with the `GERENTE` role.
