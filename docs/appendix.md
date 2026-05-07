---
id: appendix
title: Appendix — Developer Onboarding Guide
sidebar_label: Appendix / Onboarding
sidebar_position: 12
---

# Developer Onboarding Guide

**Standard Web Application Tech Stack**  
*Architecture · Tech Stack · Learning Roadmap*

---

## Overview

This guide covers the standard tech stack, system architecture, and a structured learning roadmap for developers joining the team. The stack is curated for seamless integration with the production environment and prioritises **maintainability, readability, and ease of onboarding** over raw performance.

Languages such as Rust or Go may offer superior speed, but come with a steeper learning curve that is rarely justified at our scale. The choices below reflect developer ergonomics appropriate for our user base and project size.

---

## Quick Reference

| Layer | Technology | Layer | Technology |
|-------|-----------|-------|-----------|
| **Backend** | Python / FastAPI | **Auth** | Keycloak |
| **Frontend** | TypeScript / React | **Database** | PostgreSQL |
| **ORM** | SQLAlchemy + Alembic | **Object Storage** | S3 / FlashBlade / MinIO |
| **HTTP Client** | Axios + TanStack Query | **Infra** | OpenShift, Helm, ArgoCD |
| **Testing** | pytest + Vitest | **Security** | Trivy + SonarQube |

---

## Architecture

### System Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (your code)                │
│                                                                 │
│  Frontend                         Backend                       │
│  TypeScript · React · Vite        Python 3.13 · FastAPI        │
│  ShadCN · TailwindCSS · Axios     Uvicorn · Pydantic           │
│  TanStack Query · Keycloak-js     SQLAlchemy 2.x · Alembic     │
│                                   psycopg · Boto3 · pytest      │
│                                                                 │
│  ▼ API requests + Keycloak token                               │
│  ▼ Admin API                                                    │
│  ▼ SQLAlchemy queries                                           │
│  ▼ Boto3 calls                                                  │
├─────────────────────────────────────────────────────────────────┤
│                MANAGED SERVICES (not owned by your team)        │
│                                                                 │
│  Keycloak                  PostgreSQL          S3 / Storage     │
│  Auth & authorisation      Relational DB       Files            │
│  Token issuance · SSO      All app data        Presigned URLs   │
│  RBAC                      Schema via Alembic                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Rules

**Backend only:**
- Source of truth for all application data
- All business logic, permission checks, and state transitions
- Sole reader/writer of the database via SQLAlchemy
- Sole modifier of object storage via Boto3
- Sole administrator of Keycloak (confidential client, Admin API)
- All API endpoints must validate the Keycloak token before processing

**Frontend only:**
- Presents UI and collects user input
- Sends requests to backend with Keycloak token attached
- UI-only validation (required fields, input formatting, basic feedback)
- Reads object storage via presigned GET URLs only — no direct writes
- Interacts with Keycloak only for login and token retrieval (keycloak-js)

:::note
Local development uses local versions of managed services (no SSL certs needed). Production requires SSL — missing certs will cause errors.
:::

---

## Full Tech Stack Reference

### Backend

| Component | Package | Notes |
|-----------|---------|-------|
| Language | `python3.13` | Latest stable; upgrade with project age |
| API Framework | `fastapi` + `uvicorn` | Auto OpenAPI docs, async, type-safe |
| Validation | `pydantic` | Validates & parses all incoming request bodies |
| ORM | `sqlalchemy` + `fastapi-sqlalchemy` | Python objects ↔ SQL |
| DB Driver | `psycopg` | Used internally by SQLAlchemy; no manual usage needed |
| Schema Migrations | `alembic` | Safe schema changes in production |
| Auth Adapter | `python-keycloak` | Only for confidential client (Admin API) use |
| Storage Adapter | `boto3` | S3-compatible object storage |
| Logger | `logging` | Native Python logging module |
| Testing | `pytest` + `unittest.mock` | Test runner + mocking |

### Frontend

| Component | Package | Notes |
|-----------|---------|-------|
| Language | TypeScript 6+ | Strongly typed, de facto React language |
| Build Tool | `vite` | Replaces CRA — much faster HMR |
| UI Framework | `react@19` | Component-based, state-first |
| Routing | `react-router` | SPA routing with history support |
| HTTP Client | `axios` | Promise-based HTTP client with interceptors |
| State + Data | `@tanstack/react-query` | Async data fetching, caching, mutations |
| Components | `shadcn/ui` | Tailwind-based, owned — not an npm dependency |
| Styling | `tailwindcss` | Utility-first CSS |
| Auth | `keycloak-js` | PKCE flow, token management, SSO |
| Testing | `vitest` | Fast, browser-native, Vite-integrated |

---

## Learning Roadmap

Work through these resources in order. Mark off each section as you complete it.

### Phase 1 — Foundation

- [ ] [JavaScript Tutorial](https://javascript.info/) — if not already familiar
- [ ] [TypeScript Tutorial](https://www.youtube.com/watch?v=d56mG7DezGs)
- [ ] [Python Download & Setup](https://www.python.org/downloads/)
- [ ] [Git Basics](https://git-scm.com/book/en/v2) (Chapters 1-3)

### Phase 2 — Backend Core

- [ ] [FastAPI Tutorial (with Pydantic)](https://www.youtube.com/watch?v=iWS9ogMPOI0)
- [ ] [Pydantic Tutorial](https://www.youtube.com/watch?v=XIdQ6gO3Anc)
- [ ] [SQLAlchemy Fundamentals](https://www.youtube.com/watch?v=xr7vDSFXjW0)
- [ ] [Alembic with SQLAlchemy](https://www.youtube.com/watch?v=i9RX03zFDHU&t=1363s)
- [ ] [FastAPI + SQLAlchemy Integration](https://www.youtube.com/watch?v=xq1Snezb1rs)

### Phase 3 — Frontend Core

- [ ] [TypeScript with React](https://www.youtube.com/watch?v=xTVQZ46wc28)
- [ ] [React Tutorial — Fundamentals](https://www.youtube.com/watch?v=SqcY0GlETPk)
- [ ] [Vite + React Setup](https://www.youtube.com/watch?v=jufPO-r6bt0)
- [ ] [React Router Tutorial](https://www.youtube.com/watch?v=oTIJunBa6MA)
- [ ] [TanStack Query Tutorial](https://www.youtube.com/watch?v=mPaCnwpFvZY)
- [ ] [Tailwind Installation (v4)](https://www.youtube.com/watch?v=sHnG8tIYMB4)
- [ ] [ShadCN Tutorial](https://www.youtube.com/watch?v=Yz3Rfn_UJOo)

### Phase 4 — Authentication & Infrastructure

- [ ] [Keycloak Tutorial](https://www.youtube.com/watch?v=fvxQ8bW0vO8)
- [ ] [Keycloak-js with Vite + React](https://www.youtube.com/watch?v=5z6gy4WGnUs)
- [ ] [FastAPI + React Integration](https://www.youtube.com/watch?v=aSdVU9-SxH4)
- [ ] Read: [Tech Stack section](./tech-stack/overview) of this bible
- [ ] Read: [Architecture section](./architecture/overview) of this bible

### Phase 5 — DevOps (for DevOps engineers)

- [ ] [Docker Getting Started](https://www.docker.com/get-started/)
- [ ] [Helm Documentation](https://helm.sh/docs/)
- [ ] [GitHub Actions Documentation](https://github.com/features/actions)
- [ ] [ArgoCD Installation](https://argo-cd.readthedocs.io/en/stable/)
- [ ] [OpenShift Download](https://developers.redhat.com/products/openshift/download)
