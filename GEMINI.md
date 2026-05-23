# Textil-APP - Project Guidelines

## Architecture & Standards

- **Authentication:** Exclusive use of Keycloak (OIDC). Traditional Django login is disabled.
- **Auth Strategy:** Implemented using the **Strategy Pattern** in `Texcore/services/auth_strategies.py`. This allows for swapping or extending auth methods (e.g., Password vs Keycloak).
- **Service Layer:** Business logic is isolated in `Texcore/services/` (e.g., `auth_service.py`, `hilatura_service.py`).
- **Repository Pattern:** Data access is abstracted in `Texcore/services/repositories.py` to decouple business logic from Django models.
- **Role-Based Access Control (RBAC):** Roles (`admin`, `preparador`, `operario`) are synchronized from Keycloak to the local `Profile` model during login.

## Setup Requirements

- Environment variables must be loaded via `.env` (configured in `manage.py` and `wsgi.py`).
- Required Keycloak scopes: `openid`, `profile`, `email`.
- Keycloak Client Roles must match: `admin`, `preparador`, `operario`.
