---
id: architecture-overview
title: Architecture Overview
sidebar_label: Overview
sidebar_position: 1
---

# Clean Code Architecture Overview

![Clean code architecture — 3 layer overview](/img/image16.png)

Inspired by [Google's Mobile Architecture](https://developer.android.com/topic/architecture), the architecture is generalised into **3 layers** where the frontend and backend share responsibility for presentation, while business logic and data access remain strictly within the backend.

## The Three Layers

| Layer | Also Known As | Responsibility |
|-------|--------------|---------------|
| **UI Layer** | Presentation Layer | Handles interaction with the outside world. Validates input and formats output. Does NOT implement business logic or access the database directly. |
| **Domain Layer** | Service Layer | Contains core business rules and workflows. Orchestrates operations via interfaces to the Data Layer. Independent of frameworks, UI, and database technology. |
| **Data Layer** | Repository / Adapter Layer | Manages persistence and access to external systems. Source of truth for data. Shields domain and presentation layers from storage and infrastructure details. |

**Dependencies flow inward:** The Presentation Layer interacts only with the Domain Layer, which calls the Data Layer through repository interfaces. The Data Layer implements these interfaces using the database or external services. No layer calls outward.

## Benefits of This Architecture

- **Isolation of concerns** — changing from React to Svelte won't affect the rest of the layers
- **Testability** — ability to test business logic in isolation
- **Maintainability** — new features can be added without breaking unrelated parts
- **Fewer bugs** — easier to track and fix bugs

## Architecture Component Reference

![Architecture component reference — which layer each component belongs to](/img/image17.png)

| Architecture Component | Layer |
|-----------------------|-------|
| FastAPI Router | UI Layer |
| Pydantic Schemas | UI Layer |
| Service | Domain Layer |
| Repository | Data Layer |
| Adapter (Keycloak, S3) | Data Layer |
| SQLAlchemy Model | Data Layer |

## Overarching File Structure

Your files should be structured in a way that is understandable and meaningful among developers.

```
.
├── projectname-backend/
│
├── projectname-frontend/
│
├── projectname-submission/
│
├── .dockerignore
│
├── .gitignore
│
└── README.md
```

Your top-level hierarchy should contain:
- Three folders (backend, frontend, submission)
- Other files required to build the entire application
- Documentation for the entire application

There should **not** be any backend or frontend-specific folders (like `package.json`, `package-lock.json`, or virtual environment) at the top level.

Your **submissions folder** should contain all materials needed and required for RFO as well as production.
