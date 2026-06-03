# Research and Technical Decisions: Inventory Management RBAC

This document outlines the research and architectural decisions made for the Bakery Inventory Management system update.

## Backend Framework
- **Decision**: FastAPI (Python)
- **Rationale**: FastAPI provides high performance, automatic OpenAPI documentation, and excellent support for asynchronous operations. It is well-suited for a REST API that needs to handle real-time inventory updates and dashboard metrics.
- **Alternatives considered**: Flask (simpler but lacks native async and automatic docs), Django (too heavy for this specific micro-service scope).

## Authentication & Authorization
- **Decision**: JWT (JSON Web Tokens) with a custom Middleware for RBAC.
- **Rationale**: JWT is stateless, making it ideal for a modern React + Python architecture. Roles (Manager/Attendant) will be encoded in the token payload. A custom middleware in FastAPI will intercept requests to restricted routes (e.g., product creation) and verify the `role` claim.
- **Alternatives considered**: Session-based auth (requires server-side state, more complex to scale and integrate with React).

## Database Interface
- **Decision**: SQLAlchemy (ORM) + Alembic (Migrations).
- **Rationale**: SQLAlchemy is the industry standard for Python database interaction, providing type safety and a clean MVC "Model" layer. Alembic ensures that schema changes (like adding the Soft Delete column) are tracked and reproducible.

## Frontend State Management
- **Decision**: React Context API + LocalStorage for Auth.
- **Rationale**: For a project of this scale, Redux is overkill. Context API is sufficient to manage the logged-in user's state and token globally across protected routes.
- **Alternatives considered**: Redux Toolkit (good for larger apps, but adds unnecessary boilerplate here).

## Product Deletion Strategy
- **Decision**: Soft Delete using a `deletado` (boolean) or `inativo` column.
- **Rationale**: As clarified in the specification, we must preserve history. A hard delete would break foreign keys in the `historico_movimentacoes` table.
