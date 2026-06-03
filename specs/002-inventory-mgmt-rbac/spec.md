# Feature Specification: Sistema de Gestão de Estoque para Padaria (Update)

**Feature Branch**: `002-inventory-mgmt-rbac`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: User description: "Crie a especificação atualizada das funcionalidades do projeto 'Sistema de Gestão de Estoque para Padaria'. Altere o arquivo specs/core-features/spec.md adicionando o novo módulo de Autenticação e Controle de Acesso..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Login and Role-Based Access (Priority: P1)

As a system user, I want to log in securely so that I can access only the features allowed for my role (Manager or Attendant).

**Why this priority**: Security is foundational. Without authentication and RBAC, data integrity and business rules cannot be enforced.

**Independent Test**: Can be tested by logging in with different credentials and verifying that UI elements and API routes are restricted according to the role.

**Acceptance Scenarios**:

1. **Given** the login screen, **When** I enter valid Manager credentials, **Then** I am redirected to the Dashboard with full CRUD access to products and settings.
2. **Given** the login screen, **When** I enter valid Attendant credentials, **Then** I am redirected to the Inventory Table with restricted access (no editing of products, prices, or minimum stocks).
3. **Given** an Attendant is logged in, **When** they attempt to manually navigate to the "Add Product" route, **Then** the system redirects them to an "Access Denied" page or back to the Inventory Table.

---

### User Story 2 - Managerial Inventory Control (Priority: P1)

As a Manager, I want to create, update, and delete products/ingredients so that I can maintain an accurate catalog of items, prices, and stock thresholds.

**Why this priority**: Correct item definitions (prices, categories, minimum stocks) are essential for business operations and alerts.

**Independent Test**: Can be fully tested by creating a product as a Manager and verifying its presence in the Inventory Table with correct attributes.

**Acceptance Scenarios**:

1. **Given** a Manager is logged in, **When** they create a new product with Name, Category, Initial Quantity, Min Stock, Unit Price, and Expiry Date, **Then** the product appears in the inventory list.
2. **Given** an existing product, **When** a Manager updates the Unit Price or Min Stock, **Then** the changes are immediately reflected and applied to future movements.
3. **Given** a product in the system, **When** a Manager deletes it, **Then** it is no longer visible in the active inventory, but its movement history is preserved for audit.

---

### User Story 3 - Recording Stock Movements (Priority: P1)

As any logged-in user, I want to record stock entries (purchases) and exits (sales/waste) so that the current inventory levels are always up to date.

**Why this priority**: Real-time stock tracking prevents "stockouts" and ensures the bakery can fulfill customer orders.

**Independent Test**: Can be tested by recording an exit for a product and verifying that the "Quantity Current" decreases by the specified amount and the user is logged as the responsible.

**Acceptance Scenarios**:

1. **Given** a product with 10 units, **When** an Attendant records an exit of 5 units, **Then** the Quantity Current becomes 5 and a history log is created with the Attendant's name.
2. **Given** a product with 5 units, **When** a user tries to record an exit of 10 units, **Then** the system displays a warning and blocks the transaction (if strict mode is enabled) or allows it with a high-priority "Negative Stock" alert.
3. **Given** a movement record, **When** it is saved, **Then** it automatically includes the current timestamp and the ID of the user who performed the action.

---

### User Story 4 - Smart Alerts and Loss Prevention (Priority: P2)

As a Manager, I want to receive alerts for low stock, expiring items, and stagnant products so that I can take proactive measures to avoid losses or stockouts.

**Why this priority**: Directly impacts profitability by reducing waste (vencimento) and ensuring availability.

**Independent Test**: Can be tested by setting a product's expiry date to 5 days from now and verifying it appears in the "Expiration Alert" list.

**Acceptance Scenarios**:

1. **Given** a product with an expiry date <= 7 days away, **When** the Dashboard is loaded, **Then** the product is highlighted in the "Vencimento" alert card.
2. **Given** a product where Quantity Current <= Min Stock, **When** any movement occurs, **Then** a "Low Stock" alert is triggered for that item.
3. **Given** a product that hasn't had an exit movement in the last 15 days, **When** the "Stagnant Items" report is generated, **Then** this item is listed as "Encalhado".

---

### User Story 5 - Business Intelligence Dashboard (Priority: P2)

As a Manager, I want to see a summarized view of the bakery's health through metrics and recent activity feeds.

**Why this priority**: Enables quick decision-making based on financial risk and sales performance.

**Independent Test**: Can be tested by performing movements and verifying that the "Last 5 Movements" feed and "Best Seller" metric update accordingly.

**Acceptance Scenarios**:

1. **Given** the Dashboard, **When** loaded by a Manager, **Then** it shows cards for: Total Value at Risk (expiring items), Total Waste Cost, and Most Sold product (by total quantity).
2. **Given** multiple categories (Bread, Pastry, Cold Cuts), **When** viewing the Dashboard, **Then** a distribution chart shows the stock volume or value per category.
3. **Given** recent activity, **When** the Dashboard is viewed, **Then** the feed displays the last 5 movements with date, user, and type.

### Edge Cases

- **Expiration Date in the Past**: If an item is registered or updated with an expiry date that has already passed, the system MUST immediately flag it as "Expired" and exclude it from available stock for sales.
- **Negative Movement Input**: If a user attempts to record a negative quantity (e.g., "-5") in the entry/exit field, the system MUST block the action and require a positive integer.
- **Product Deletion with History**: If a Manager attempts to delete a product that has existing movement records, the system MUST perform a "Soft Delete" (archive), marking the record as inactive and keeping it in the database for history but removing the item from active inventory views and search.
- **Session Timeout**: If a user's session expires due to inactivity, the system MUST redirect to the login screen and preserve any unsaved movement data in a local draft if possible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST have a login screen requiring username/password.
- **FR-002**: System MUST implement RBAC with at least two roles: "Gerente/Dono" and "Atendente/Funcionário".
- **FR-003**: System MUST restrict Product/Ingredient CRUD (Create, Edit, Delete) to the "Gerente/Dono" role.
- **FR-004**: System MUST allow all users to view the Inventory Table.
- **FR-005**: System MUST allow all users to record stock movements (Input/Output).
- **FR-006**: System MUST automatically capture and store the responsible user's ID for every movement.
- **FR-007**: System MUST validate movement quantities and MUST BLOCK any transaction that would result in a negative stock level.
- **FR-008**: System MUST generate "Expiration Alerts" for items with Expiry Date ≤ 7 days from today.
- **FR-009**: System MUST generate "Low Stock Alerts" for items where Current Quantity ≤ Min Stock.
- **FR-010**: System MUST identify "Stagnant Items" (Encalhados) if no exits recorded in the last 15 days.
- **FR-011**: System MUST provide a Dashboard (restricted to Manager) with cards for: Resume, Category Distribution, Financial Risk, Waste Cost, Top Seller, Top Expired, and Recent Feed.
- **FR-012**: System MUST maintain a movement history log including: Date/Time, Product, Type, Quantity, User, and Optional Observation.

### Key Entities *(include if feature involves data)*

- **User**: Represents a staff member. Attributes: Name, Role, Credentials.
- **Product/Ingredient**: The items being tracked. Attributes: Name, Category, Quantity Current, Min Stock, Unit Price, Expiry Date.
- **Movement**: A record of stock change. Attributes: Timestamp, ProductID, Type (Entry/Exit), Quantity, UserID, Observation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can record a sale (stock exit) in under 15 seconds.
- **SC-002**: Managers can generate a "Financial Risk" report in under 5 seconds.
- **SC-003**: 100% of movements are linked to the correct user who performed them.
- **SC-004**: System prevents 100% of unauthorized attempts by Attendants to access price editing routes.

## Assumptions

- "Financial Value at Risk" is the sum of (Unit Price * Quantity) for all items expiring within 7 days.
- "Waste Cost" is the total value of movements marked as "Exits" with the observation "Vencido/Descarte".
- The system will be accessed via a web browser on local bakery terminals.
- Initial user accounts will be created via a database script or admin-only setup.
ervation "Vencido/Descarte".
- The system will be accessed via a web browser on local bakery terminals.
- Initial user accounts will be created via a database script or admin-only setup.
tabase script or admin-only setup.
