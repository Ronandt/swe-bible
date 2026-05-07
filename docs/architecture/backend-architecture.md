---
id: backend-architecture
title: Backend Clean Architecture
sidebar_label: Backend Architecture
sidebar_position: 2
---

# Backend Clean Architecture

## Overview

![Backend clean architecture — three layers](/img/image18.png)

The backend is separated into three layers: **UI layer**, **domain layer**, and **data layer**. Each layer has a defined responsibility, and the implementation of a higher layer must not leak into a lower one:

- The domain layer should have **no knowledge of FastAPI request/response mechanics**
- The data layer should have **no knowledge of either the domain or UI layer**

### Type Boundaries Between Layers

![Type boundaries — SQLAlchemy models between data/domain, Pydantic models between domain/UI](/img/image19.png)

Layers do not share a single common type across the whole stack. Instead:

- **SQLAlchemy models** are the currency between the data and domain layers
- **Pydantic models** are the currency between the domain and UI layers
- The **domain layer** is the only layer that sees both, and is responsible for converting between them

**Why this split exists:**
SQLAlchemy models are tightly coupled to the database session — they carry ORM machinery, lazy-load relationships on attribute access, and can trigger additional queries if accessed outside a session context. Pydantic models, by contrast, are plain validated data — no session, no lazy loading, no side effects. They serialise cleanly and describe exactly the shape of the data your API exposes.

:::tip Rule of Thumb
**A layer may import *what* something is, but not *how* it is handled by another layer.**
:::

### When Your Application Does Not Own the DB Layer

![When the data layer calls an internal API instead of the database directly](/img/image20.png)

If your architecture is modified such that the data layer calls an internal API instead of querying the database directly, this boundary shifts. The repository receives JSON from the internal API and parses it into a Pydantic model directly — SQLAlchemy is no longer involved, and the domain layer never sees an ORM object.

### Vertical Slice Architecture (Feature-Based)

![Vertical slice architecture — organise by feature, not by layer](/img/image21.png)

With the exception of shared architectural components (adapters, utils, dependencies), **routers, repositories, services, and related DB models should be in one folder per use case**.

This follows the **Common Closure Principle (CCP):**
> *"Classes within a component should be grouped together based on the same kind of changes they are susceptible to."*

Therefore, code that is more reliant on another part of the codebase should be closer to one another — directories should be split by feature.

---

## Backend File Structure

```
architecture-project-backend/
│
├── app/
│   ├── __init__.py
│   │
│   ├── main.py                        # FastAPI app instance, middleware, startup events
│   ├── .env                           # Environment variables for development
│   ├── example.env                    # Example env file to commit — never commit .env
│   │
│   ├── features/                      # Feature-based modules
│   │   │
│   │   ├── users/
│   │   │   ├── __init__.py
│   │   │   ├── router.py              # FastAPI routes for user-related endpoints
│   │   │   ├── schemas.py             # Pydantic request/response models for the Users API
│   │   │   ├── model.py               # SQLAlchemy User model
│   │   │   ├── repository.py          # Data access — user-specific queries and persistence
│   │   │   ├── service.py             # User business logic (uses repository and adapters)
│   │   │   └── dependencies.py        # FastAPI dependency providers scoped to Users
│   │   │
│   │   └── items/
│   │       ├── __init__.py
│   │       ├── router.py              # FastAPI routes for item-related endpoints
│   │       ├── schemas.py             # Pydantic request/response models for the Items API
│   │       ├── model.py               # SQLAlchemy Item model
│   │       ├── repository.py          # Data access — item-specific queries and persistence
│   │       ├── service.py             # Item business logic (uses repository and adapters)
│   │       └── dependencies.py        # FastAPI dependency providers scoped to Items
│   │
│   ├── infrastructure/                # External system integrations and app-level plumbing
│   │   ├── __init__.py
│   │   ├── database.py                # SQLAlchemy engine and session factory
│   │   ├── base.py                    # SQLAlchemy declarative Base class
│   │   ├── middleware.py              # Global FastAPI middleware
│   │   ├── logging.py                 # Logging configuration — called once at startup
│   │   │
│   │   └── adapters/                  # Wrappers around external services
│   │       ├── keycloak_adapter.py    # Keycloak integration
│   │       └── s3_adapter.py          # S3 integration
│   │
│   └── shared/                        # Cross-cutting code used by all layers
│       ├── __init__.py
│       ├── config.py                  # Pydantic Settings — all env vars declared here
│       ├── dependencies.py            # Shared FastAPI dependencies (auth, adapters, DB session)
│       ├── schemas.py                 # Shared Pydantic models (TokenClaims, RoleAccess)
│       ├── exceptions.py              # Custom application exceptions with HTTP status codes
│       └── utils/
│           ├── __init__.py
│           └── helpers.py             # Shared utility functions
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                    # Shared pytest fixtures
│   ├── test_auth.py                   # Auth tests
│   └── test_item_service.py           # Item service tests
│
└── requirements.txt
```

### File Explanations

| File | Purpose |
|------|---------|
| `main.py` | Core of the application. Contains middleware (for logging), initialisation of FastAPI, database initialisation and prepopulation, S3 instance, and registration of API Routers. |
| `.env` | All secrets and configuration for development. **Must be git-ignored.** |
| `features/.../router.py` | Interface layer — handles request validation, routing, and response formatting. **All business logic should be in the service layer.** |
| `features/.../model.py` | SQLAlchemy database models/tables. **Should NOT be directly interacted with in routes** — only used in repositories. |
| `features/.../repository.py` | Source of truth for data. Handles all direct database interactions (CRUD). Business rules should NOT be implemented here. |
| `features/.../service.py` | Core business logic. Interacts with repositories and may call adapters (S3, Keycloak). |
| `infrastructure/adapters/` | Wrappers around external services (Keycloak, S3). Instantiated once in `shared/dependencies.py` and injected via `Depends()`. |
| `features/.../schemas.py` | Pydantic models for request validation and response formatting. Should NOT contain business logic or database operations. |
| `shared/utils/` | Convenient shared methods (formatting, UUID generators, random numbers, file parsing). |
| `shared/exceptions.py` | Centralised exception definitions for consistent error handling across features. |
| `shared/middleware.py` | Reserved for cross-cutting concerns (logging, CORS, request ID injection). **Authentication must NOT be implemented as middleware.** |
| `shared/config.py` | Declares all environment variables as a typed Pydantic Settings class. The **only** place that reads from the environment — no other file should call `os.environ` directly. |
| `shared/dependencies.py` | The **sole** place where repositories, services, and adapters are instantiated and wired together. |
| `requirements.txt` | Allows installation of all required dependencies with one command. |

---

## Handling Configuration — `shared/config.py`

All environment variables are declared in a single `Settings` class using `pydantic-settings`.

```python
class Settings(BaseSettings):
    DATABASE_URL:           str       = "sqlite:///./test.db"
    KEYCLOAK_REALM:         str
    KEYCLOAK_URL:           str
    KEYCLOAK_CLIENT_SECRET: SecretStr = SecretStr("")
    S3_ACCESS_KEY:          SecretStr = SecretStr("")
    CORS_ORIGINS:           list[str] = ["http://localhost:5173"]

settings = Settings()
```

Key points:
- Fields without defaults (e.g. `KEYCLOAK_REALM`) are **required** — if absent, the application refuses to start entirely rather than failing silently at runtime
- Sensitive values use `SecretStr` — masks the value in logs and string representations, so you can safely log the full configuration at startup without leaking credentials

---

## Concrete Code Examples

![Architecture components — Router, Service, Repository, Adapter layers](/img/image22.png)

### UI Layer — FastAPI Router

```python
@router.post("", response_model=ItemResponse, status_code=201)
def create_item(
    item_data: ItemCreateRequest,
    claims: TokenClaims = Depends(get_current_user),
    service: ItemService = Depends(get_item_service),
):
    return service.create_item(item_data.title, item_data.description, claims.sub)
```

The router handles the request and response. `TokenClaims` is resolved via `Depends(get_current_user)` — if the token is missing or invalid, the dependency raises a `401` before the handler is ever reached. The router doesn't know or care how authentication works — it simply receives a `TokenClaims` instance.

### Domain Layer — Service

```python
class ItemService:
    def __init__(self, repository: ItemRepository, s3_client=None):
        self.repository = repository
        self.s3_client = s3_client

    def create_item(self, title: str, description: str | None, keycloak_user_id: str) -> ItemResponse:
        sanitised_title = title.strip()
        sanitised_description = description.strip() if description else ""
        if len(sanitised_title) == 0:
            raise InvalidItemTitle("Title must have more than 0 characters")
        if len(sanitised_title) > 30:
            raise InvalidItemTitle("Title exceeds 30 characters")
        if len(sanitised_description) > 100:
            raise InvalidItemDescription("Description exceeds 100 characters")
        item = self.repository.create_item(sanitised_title, sanitised_description, keycloak_user_id)
        return self._resolve(item)

    def _resolve(self, item: Item) -> ItemResponse:
        image_url: str | None = None
        if item.image_url and self.s3_client:
            image_url = self.s3_client.generate_presigned_url(item.image_url)
        return ItemResponse(
            id=item.id,
            title=item.title,
            description=item.description,
            owner_id=item.owner_id,
            image_url=image_url,
        )
```

The service has no knowledge of FastAPI, HTTP, or how data will be rendered. Violations raise typed domain exceptions, not HTTP errors. The `_resolve` method is where the SQLAlchemy model is translated into a Pydantic model — the stored S3 object key is also exchanged for a fresh presigned URL here.

![Translation between Repository and Router — the router is then safe to return the ItemResponse as an HTTP response](/img/image23.png)

### Data Layer — Repository

```python
class ItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_item(self, title: str, description: str, keycloak_user_id: str) -> Item:
        try:
            item = Item(title=title, description=description, owner_id=keycloak_user_id)
            self.db.add(item)
            self.db.commit()
            self.db.refresh(item)
            return item
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseUnavailable("Failed to create item") from e
```

The repository handles all database interaction — managing transactions, constructing queries, and ensuring entities exist. The service calls `create_item` and receives a SQLAlchemy `Item` back; it has no knowledge of how that item was persisted.

### Data Layer — Adapter

```python
class KeycloakAdapter:
    def __init__(
        self,
        server_url: str = settings.KEYCLOAK_URL,
        realm: str = settings.KEYCLOAK_REALM,
        client_id: str = settings.KEYCLOAK_CLIENT_ID,
        client_secret: SecretStr = settings.KEYCLOAK_CLIENT_SECRET,
        cert_filepath: str = settings.KEYCLOAK_CERT_FILEPATH,
    ):
        ...
        self._public_key_cache: str | None = None

    def verify_user_token(self, user_token: str) -> tuple[bool, TokenClaims | None]:
        ...
```

The adapter caches the realm's public key so it isn't fetched from Keycloak on every request — only on first use or when a key rotation is suspected.

---

## Dependency Injection

![Dependency injection graph](/img/image24.png)

FastAPI's `Depends()` feature makes dependency injection easier — you do not have to modify every single instance if you change the constructor of a service or repository.

```python
def get_item_service(
    repository: ItemRepository = Depends(get_item_repository),
    s3: S3Adapter = Depends(get_s3_adapter),
) -> ItemService:
    return ItemService(repository, s3)
```

```python
def get_current_user(
    authorization: HTTPAuthorizationCredentials = Depends(_http_bearer),
    adapter: KeycloakAdapter = Depends(get_keycloak_adapter),
) -> TokenClaims:
    valid, claims = adapter.verify_user_token(authorization)
    if not valid or claims is None:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return claims
```

:::important
If `ItemService` later requires a new dependency, **only `dependencies.py` needs to change** — the router picks it up automatically. Instantiation must NEVER happen outside `dependencies.py`.
:::

- [FastAPI Depends Tutorial](https://www.youtube.com/watch?v=f270BoTicMA)
- [FastAPI DI Documentation](https://fastapi.tiangolo.com/tutorial/dependencies/)

---

## Middleware

Middleware is reserved for concerns that genuinely need to run on every request — such as logging, CORS, and request ID injection. **Authentication must NOT be handled here.**

```python
# app/shared/middleware.py
async def logging_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    logger.info(
        "%s %s %s %.3fs",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response
```

---

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Constants | ALL_CAPS_SNAKE_CASE | `TIMEOUT_MAX_SECONDS` |
| Variables | lowercase_snake_case | `this_is_a_variable` |
| Functions | lowercase_snake_case | `this_is_a_function` |
| Classes | PascalCase | `ThisIsAClass` |
| Exceptions | PascalCase | `AuthenticationError` |
| File Names | lowercase_snake_case | `this_is_a_file` |
| Packages & Modules | lowercase_snake_case | `my_module` |

---

## Error Handling

| Layer | Responsibility |
|-------|---------------|
| **Data Layer (Repositories / Adapters)** | Catch errors related to persistence or external services. Raise meaningful exceptions that don't leak implementation details. |
| **Domain / Service Layer** | Exceptions from adapters/repositories should generally bubble up. Raise domain-level errors (e.g., `InsufficientFundsError`). |
| **Presentation Layer (Routers)** | Catch exceptions from the domain layer, format HTTP responses (status codes, messages). |

Custom errors must carry **clear semantic meaning** — named by domain intent, not implementation details (e.g. `UserNotFoundError`, not `SQLAlchemyNoResultFoundError`).

### Exception Class Design

```python
# app/shared/exceptions.py
class ApplicationException(Exception):
    def __init__(self, message: str, http_status: int = 500, details: dict | None = None):
        super().__init__(message)
        self.message = message
        self.http_status = http_status
        self.details = details or {}

class UserNotFoundError(ApplicationException):
    def __init__(self, user_id: int):
        super().__init__(f"User with ID {user_id} not found.", http_status=404)

class InsufficientFundsError(ApplicationException):
    def __init__(self, message: str = "Not enough money in account."):
        super().__init__(message, http_status=400)

class DataStorageError(ApplicationException):
    def __init__(self, message: str = "Database is currently unreachable."):
        super().__init__(message, http_status=503)
```

### FastAPI Global Exception Handler

```python
# app/main.py
@app.exception_handler(ApplicationException)
async def global_exception_handler(request: Request, exc: ApplicationException):
    return JSONResponse(
        status_code=exc.http_status,
        content={
            "message": exc.message,
            "details": exc.details,
            "path": str(request.url)
        }
    )

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal Server Error",
            "details": str(exc),
            "path": str(request.url)
        }
    )
```

:::tip
In this design, **repository exceptions are NOT caught in the service/domain layer** if they are already raised as custom exceptions. Exceptions are allowed to bubble up to the API layer, where the FastAPI handler translates them automatically. This significantly reduces boilerplate.
:::

[FastAPI Error Handling Documentation](https://fastapi.tiangolo.com/tutorial/handling-errors/#add-custom-headers)
