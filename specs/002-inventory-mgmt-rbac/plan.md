# Implementation Plan: Inventory Management & RBAC

**Branch**: `002-inventory-mgmt-rbac` | **Date**: 2026-06-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-inventory-mgmt-rbac/spec.md`

## Summary
Implement a secure inventory management system with role-based access control (RBAC), stock movement tracking, and a managerial dashboard. The system will use a Python (FastAPI) backend with JWT authentication and a React frontend with protected routes.

## Technical Context

**Language/Version**: Python 3.11+, JavaScript (React 18)
**Primary Dependencies**: FastAPI, SQLAlchemy, Alembic, PyJWT (Backend); React, React Router, Axios (Frontend)
**Storage**: PostgreSQL
**Testing**: pytest (Backend), Jest/React Testing Library (Frontend)
**Target Platform**: Docker-ready Web Application
**Project Type**: Web Service + Single Page Application
**Performance Goals**: API response < 200ms for primary listing/creation; Dashboard calculation < 500ms.
**Constraints**: No cards for inventory list (MUST be table); Hard block on negative stock; Soft delete for products.
**Scale/Scope**: ~1k products, ~10k movements/month, 2 user roles.

## Constitution Check

- **I. MVC Rigor**: PASS (Backend Controllers handle logic; React Views handle display).
- **II. Clean React**: PASS (Functional components + Context API).
- **III. Visual Alerts**: PASS (Dashboard cards + Table highlighting for low stock/expiry).
- **IV. Mandatory Table**: PASS (Specified `EstoqueDataTable` as the only view for inventory).
- **V. DB Optimization**: PASS (Indices planned for `produto_id` and `data_hora`).

## Project Structure

```text
backend/
├── main.py              # Entry point
├── auth/                # JWT & Middleware
├── models/              # SQLAlchemy schemas
├── controllers/         # Business logic
├── api/                 # FastAPI routes
└── tests/

frontend/
├── src/
│   ├── components/      # Common UI (Table, Form)
│   ├── pages/           # Dashboard, Inventory, Login
│   ├── services/        # API calls (Axios)
│   └── context/         # AuthContext
└── tests/
```

**Structure Decision**: Option 2: Web application with decoupled `backend/` and `frontend/` folders.

## Phases

### Phase 0: Outline & Research
Completed. See [research.md](research.md).

### Phase 1: Design & Contracts
Completed. See [data-model.md](data-model.md) and [contracts/api-endpoints.md](contracts/api-endpoints.md).

### Phase 2: Implementation Strategy
1. **Infrastructure**: Setup PostgreSQL and base folders.
2. **Backend Auth**: Implement User model, login endpoint, and RBAC middleware.
3. **Inventory Core**: Implement Product model (with Soft Delete) and basic CRUD.
4. **Movements**: Implement Movement model with hard block validation and current stock updates.
5. **Frontend Foundation**: Setup React Router and AuthContext.
6. **Frontend UI**: Build `Login`, `EstoqueDataTable`, and `Dashboard`.
7. **Refinement**: Implement visual alerts (expiry/low stock) and financial risk metrics on Dashboard.
