---
id: backend
title: Backend
sidebar_label: Backend
sidebar_position: 2
---

# Backend

| Component | Technology |
|-----------|-----------|
| **Programming Language** | Python 3.13 (latest stable version) |
| **Type Hint Module** | Python hints |
| **Virtual Environment** | `.venv` (for development) |
| **API Framework** | FastAPI + Uvicorn |
| **API Request & Type Validator** | Pydantic |
| **Object Relational Mapper** | SQLAlchemy 2.x |
| **ORM + API Integrator** | FastAPI-SQLAlchemy |
| **Database Driver** | psycopg (v3) |
| **Schema Migrator** | Alembic |
| **Authentication Adapter** | python-keycloak |
| **Object Storage Adapter** | Boto3 |
| **Logger** | `logging` (native Python) |
| **Testing** | unittest + pytest |

## Responsibilities of the Backend

- Act as the **source of truth** for all data (except user-related data and object storage images themselves)
- Own all business logic and validation rules
- Sole interactor of the database (reads and writes)
- Sole modifier of object storage
- Sole interface for granting administrator permissions in Keycloak
- Sole "receiver" of data requests from the frontend

:::danger
**Business logic must NOT live on the frontend.** Permission checks, state transitions, data validation, and invariants are enforced exclusively by the backend. The frontend performs UI-only validation (required fields, formatting) — never authorisation decisions.
:::

:::warning
Every API endpoint must validate the Keycloak token **before** processing the request. No exceptions.
:::

## Programming Language

Python is highly recommended for several reasons: it is easy to onboard developers, boasts a rich ecosystem of AI and data libraries, and has established API frameworks such as Flask and FastAPI.

[Download Python 3.13](https://www.python.org/downloads/release/python-31312/)

## Type Hints

As Python is dynamically typed, tracking types for variables, functions, or class constructors can be difficult. Developers should use **Python type hints** to reduce the burden of tracking types and prevent runtime errors from invalid types.

[Python Typing Documentation & Tutorial](https://docs.python.org/3/library/typing.html)

## Virtual Environment

Using a virtual environment (`venv`) is highly recommended as it keeps dependencies project-specific, avoiding version conflicts between projects.

**Why `venv`?** Consider two projects with conflicting dependencies: Project A requires `fastapi==0.95` and `pydantic==1.x`, while Project B requires `fastapi==0.110` and `pydantic==2.x`. Installing all packages globally means one project will inevitably break.

### Creating a Python venv

```bash
# via terminal
/path/to/python -m venv .venv

# via virtualenv
virtualenv .venv --python=3.XX
```

### Activating a Python venv

[Tutorial: Activate venv in VSCode](https://www.youtube.com/watch?v=PQtlLzDiQF8)

### C/C++ Package Manager

For C/C++ projects, use [Conan](https://conan.io/) as the package manager with [`cmake`](https://cmake.org/download/) to build precompiled libraries.

- Video: [Introduction to Conan](https://youtu.be/U-_RbUqDSTc)
- Documentation: [Conan Docs](https://docs.conan.io/2/)

## API Framework — FastAPI

FastAPI is the preferred backend framework due to its modern design, superior performance, automatic data validation, built-in async support, automatic OpenAPI/Swagger documentation, and strong type safety through Python type hints. **It is just as easy to use as Flask and has a very strong community ecosystem.**

- [FastAPI Fundamentals Tutorial](https://www.youtube.com/watch?v=iWS9ogMPOI0) *(includes Pydantic — important!)*
- [FastAPI + SQLAlchemy + Database Tutorial](https://www.youtube.com/watch?v=xq1Snezb1rs)
- [FastAPI + React Integration](https://www.youtube.com/watch?v=aSdVU9-SxH4)

## API Request & Type Validator — Pydantic

Pydantic is a data validation and parsing library based on Python type hints. You define data models for your API routes using Pydantic and it:

- Validates incoming data
- Converts types automatically
- Rejects invalid data with clear errors
- Gives you strongly-typed objects to work with

[Pydantic Tutorial](https://www.youtube.com/watch?v=XIdQ6gO3Anc)

## Database Driver — psycopg

To interact with Postgres, install **psycopg**. While SQLAlchemy translates objects to SQL queries, psycopg is the interface that talks to the Postgres database. You do not need to use it directly — SQLAlchemy uses psycopg internally.

[psycopg on PyPI](https://pypi.org/project/psycopg2-binary/)

## ORM — SQLAlchemy

SQLAlchemy is recommended over raw SQL because it reduces SQL injection risk and provides a Pythonic interface. Benefits include:

- **Abstraction**: Work with Python objects instead of raw SQL
- **Portability**: Easily switch database engines without changing code
- **Maintainability**: Cleaner, more readable code
- **Relationship Management**: Simplifies handling complex table relationships
- **Query Flexibility**: Supports both high-level ORM queries and low-level SQL expressions

- [SQLAlchemy Fundamentals](https://www.youtube.com/watch?v=xr7vDSFXjW0)
- [SQLAlchemy Deep Dive](https://www.youtube.com/watch?v=6aD024WZfCs&t=687s)

## ORM + API Integrator — FastAPI-SQLAlchemy

FastAPI-SQLAlchemy makes integration between the ORM and FastAPI seamless, including database prepopulation. It handles the lifecycle of the object as a singleton, managing memory and connection management. No manual dependency injection is required for the session.

[FastAPI-SQLAlchemy on PyPI](https://pypi.org/project/FastAPI-SQLAlchemy/)

## Schema Migrator — Alembic

Alembic is vital for easy migrations in production, where deleting and rebuilding the database from scratch is not an option. It allows developers to safely apply schema changes, track migration history, and maintain data integrity without downtime.

**For simple database migrations, use the autogenerate feature — it is much more convenient.**

[Alembic with SQLAlchemy Tutorial](https://www.youtube.com/watch?v=i9RX03zFDHU&t=1363s)

## Authentication Adapter — python-keycloak

python-keycloak should be used to interact with Keycloak. **Use it only when you need a confidential client (Keycloak Admin API).** It provides convenient and secure methods to interact with Keycloak out-of-the-box.

[python-keycloak on PyPI](https://pypi.org/project/python-keycloak/)

## Object Storage Adapter — Boto3

Boto3 is the most widely used object storage library in Python, providing a consistent interface for AWS S3 and compatible local clients (FlashBlade, MinIO). It enables uploading, downloading, and managing objects and buckets with a single function.

[Boto3 + AWS Tutorial](https://www.youtube.com/watch?v=5q7FtT_DyME)

## Logger — Python `logging`

Use the native Python `logging` module. Compared to `print`, it enables:

- A flexible event logging system
- Categorised log levels (errors, warnings, infos)
- Rich supplementary data in log records

- [Logging Tutorial](https://docs.python.org/3/howto/logging.html)
- [Logging Reference](https://docs.python.org/3/library/logging.html)

## Testing — pytest + unittest

- **pytest** is the test runner — handles test discovery, fixtures, and assertions
- **unittest.mock** is used strictly for mocking and replacing external dependencies (repositories, S3 clients) with controlled test doubles

This separation allows tests to focus purely on business logic, keeping them fast, isolated, and independent of databases or network calls.

- [unittest Tutorial](https://www.youtube.com/watch?v=-F6wVOlsEAM)
- [pytest Tutorial](https://www.youtube.com/watch?v=EgpLj86ZHFQ&t=1289s)
- [unittest + pytest Together](https://docs.pytest.org/en/stable/how-to/unittest.html)
