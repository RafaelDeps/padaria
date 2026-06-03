---
description: "Task list for Sistema de Gestão de Estoque para Padaria - Inventory Management & RBAC"
---

# Tasks: Sistema de Gestão de Estoque para Padaria (RBAC Update)

**Input**: Design documents from `/specs/002-inventory-mgmt-rbac/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api-endpoints.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend/ and frontend/ directory structure
- [X] T002 Initialize FastAPI project in backend/ and React project in frontend/
- [X] T003 [P] Configure backend dependencies (SQLAlchemy, FastAPI, Alembic, JWT) in backend/requirements.txt
- [X] T004 [P] Configure frontend dependencies (Axios, React Router) in frontend/package.json
- [X] T005 [P] Setup environment variables template in .env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T006 Configure Database connection in backend/models/database.py
- [X] T007 Initialize Alembic migrations in backend/alembic/
- [X] T008 [P] Implement JWT utility functions in backend/auth/jwt_utils.py
- [X] T009 [P] Setup Base Model for SQLAlchemy in backend/models/base.py
- [X] T010 Implement RBAC Authorization Middleware in backend/auth/middleware.py
- [X] T011 [P] Setup global API error handlers in backend/api/errors.py
- [X] T012 Setup Axios interceptor for JWT in frontend/src/services/api.js
- [X] T013 Setup AuthContext for global user state in frontend/src/context/AuthContext.js

**Checkpoint**: Foundation ready - authentication and database infrastructure are in place.

---

## Phase 3: User Story 1 - Secure Login and RBAC (Priority: P1) 🎯 MVP

**Goal**: Implement protected login and role-based redirection.

**Independent Test**: Login with Manager/Attendant credentials and verify role detection in AuthContext.

### Implementation for User Story 1

- [X] T014 [P] [US1] Create User model in backend/models/user.py
- [X] T015 [US1] Create database migration for usuarios table
- [X] T016 [US1] Implement Login controller in backend/controllers/auth_controller.py
- [X] T017 [US1] Implement POST /api/auth/login endpoint in backend/api/auth_routes.py
- [X] T018 [P] [US1] Create Login page component in frontend/src/pages/Login.js
- [X] T019 [US1] Implement ProtectedRoute component in frontend/src/components/ProtectedRoute.js
- [X] T020 [US1] Create seed script for initial admin user in backend/scripts/seed.py

**Checkpoint**: User Story 1 complete - system is secured and users can authenticate.

---

## Phase 4: User Story 2 - Managerial Inventory Control (Priority: P1)

**Goal**: Allow Managers to perform CRUD on products with Soft Delete support.

**Independent Test**: Create, edit, and delete a product as a Manager and verify changes in the database.

### Implementation for User Story 2

- [X] T021 [P] [US2] Create Product model in backend/models/product.py (including is_ativo field)
- [X] T022 [US2] Create database migration for produtos table
- [X] T023 [US2] Implement Product CRUD controllers in backend/controllers/product_controller.py
- [X] T024 [US2] Implement /api/produtos endpoints (GET, POST, PUT, DELETE) in backend/api/product_routes.py
- [X] T025 [P] [US2] Create Product Form component in frontend/src/components/ProductForm.js
- [X] T026 [US2] Create Inventory Table component in frontend/src/components/EstoqueDataTable.js
- [X] T027 [US2] Implement Inventory Page in frontend/src/pages/Inventory.js

**Checkpoint**: User Story 2 complete - Managers can manage the product catalog.

---

## Phase 5: User Story 3 - Recording Stock Movements (Priority: P1)

**Goal**: Record entries/exits with hard block on negative stock.

**Independent Test**: Record an exit that exceeds current quantity and verify it is blocked.

### Implementation for User Story 3

- [X] T028 [P] [US3] Create Movement model in backend/models/movement.py
- [X] T029 [US3] Create database migration for historico_movimentacoes table
- [X] T030 [US3] Implement Movement controller with negative stock validation in backend/controllers/movement_controller.py
- [X] T031 [US3] Implement POST /api/movimentacoes endpoint in backend/api/movement_routes.py
- [X] T032 [P] [US3] Create Movement Form component in frontend/src/components/MovimentacaoForm.js
- [X] T033 [US3] Integrate Movement Form into the Inventory Table in frontend/src/components/EstoqueDataTable.js
- [X] T034 [US3] Create History Feed page in frontend/src/pages/History.js

**Checkpoint**: User Story 3 complete - stock levels are tracked accurately with safety blocks.

---

## Phase 6: User Story 4 - Smart Alerts and Loss Prevention (Priority: P2)

**Goal**: Highlight expiring or low stock items in the UI.

**Independent Test**: View inventory table and verify items <= 7 days from expiry are highlighted.

### Implementation for User Story 4

- [X] T035 [US4] Add alert logic to Product controller (expiry and low stock calculation)
- [X] T036 [US4] Implement visual highlight styles in frontend/src/components/EstoqueDataTable.js
- [X] T037 [US4] Implement "Stagnant Items" (Encalhados) filter in backend/controllers/product_controller.py

---

## Phase 7: User Story 5 - BI Dashboard (Priority: P2)

**Goal**: Visualize metrics and metrics cards for Managers.

**Independent Test**: Load Dashboard as Manager and verify "Best Seller" calculates by total quantity.

### Implementation for User Story 5

- [X] T038 [US5] Implement Dashboard statistics controller in backend/controllers/dashboard_controller.py
- [X] T039 [US5] Implement GET /api/dashboard/stats endpoint in backend/api/dashboard_routes.py
- [X] T040 [P] [US5] Create Metric Card components in frontend/src/components/MetricCard.js
- [X] T041 [P] [US5] Create Category Distribution chart in frontend/src/components/CategoryChart.js
- [X] T042 [US5] Implement Dashboard page in frontend/src/pages/Dashboard.js

---

## Phase N: Polish & Cross-Cutting Concerns

- [X] T043 Add unit tests for negative stock validation in backend/tests/test_movements.py
- [X] T044 Add unit tests for RBAC middleware in backend/tests/test_auth.py
- [X] T045 Final cleanup of unused code and console logs
- [X] T046 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Initial project structure.
- **Foundational (Phase 2)**: Depends on Phase 1 - Blocks all User Stories.
- **User Stories 1-3 (Phase 3-5)**: Critical Path (P1). Should be done sequentially as US3 depends on US2 (Product ID) and US2 depends on US1 (User ID for audit).
- **User Stories 4-5 (Phase 6-7)**: Can be done in parallel once US1-3 are stable.

### Parallel Opportunities

- Backend and Frontend setup (T003 vs T004).
- JWT Utils and SQLAlchemy Base (T008 vs T009).
- Dashboard components (T040 vs T041).
- Most models can be created in parallel within their phases.

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Setup and Foundation.
2. Implement US1 (Login).
3. Implement US2 (Inventory CRUD).
4. Implement US3 (Movements + Validation).
5. **STOP**: You now have a functional inventory system with audit logs and safety blocks.

### Incremental Delivery

- Add Alerts (US4) to provide visual feedback.
- Add Dashboard (US5) to provide business intelligence.
