---
id: tech-stack-overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

# Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| **Backend** | Python / FastAPI |
| **Frontend** | TypeScript / React |
| **Authentication** | Keycloak |
| **Database** | PostgreSQL |
| **Object Storage** | S3 / FlashBlade / MinIO |
| **Infra (build)** | OpenShift, Helm Charts, ArgoCD, GitHub Actions |
| **Security** | Trivy, SonarQube |
| **Code Quality** | Black, Flake8, ESLint, Prettier, SonarLint/SonarQube |
| **Other Tools** | VS Code, Docker, Git, PgAdmin, Postman, GitHub Desktop, Swagger, Figma |

## Tech Stack Philosophy 理念

The current tech stack is curated to have **seamless integration with production**. It was chosen for its developer **ergonomics over speed, prioritising maintainability, readability, and ease of onboarding new team members.**

Languages such as Rust or Go may offer superior speed and robustness, but also come with a steeper learning curve and more challenging developer experience — especially where low-level control is not strictly necessary. For every project, performance requirements should be considered thoroughly to determine the language to use.

A more "enterprise stack" emphasises robustness and speed but requires developers to invest more time upfront, which may not always be justified for smaller-scale projects or prototypes.

## Recommended Basic Architecture

![Recommended Basic Architecture diagram](/img/image2.png)

The architecture for web applications places containers/systems outside the dotted line as managed production services.

**To test managed services in your development environment, download their local versions** (detailed in later sections). Note that local versions **may not be identical to production** — for example, you do **not** need to mount an SSL cert for managed services in development, which is **mandatory in production**.

## Extending The Architecture

![Extending the architecture](/img/image3.png)

This document covers the core technologies: database, frontend, and backend. If your application requires additional services such as **Redis, AI inference APIs, third-party APIs, or microservices**, you may extend the architecture. These can be connected via connection strings or through a front-facing API if the service needs to be consumed by multiple services.

:::important
Whichever approach is chosen, **wrap the integration in an adapter in the backend**. Adapters keep external service details — connection logic, request formats, authentication — contained in one place. If the service changes or is swapped out entirely, only the adapter needs to change.
:::

## Other Architectures & Modifying The Recommended Architecture

![Other architectures & modified architecture](/img/image4.png)

The recommended architecture is a starting point, not a strict constraint. A common variation is when services such as object storage or the database are not accessed directly by your backend, but are instead managed by separate internal APIs that your team owns.

From an adapter perspective, the approach is identical in both cases — your backend still wraps every interaction in an adapter. The only difference is what the adapter points at.

### Framework Consistency Across Internal APIs

![Framework consistency across internal APIs](/img/image5.png)

If possible, other internal APIs should follow the same technologies used in this stack. This matters for two reasons:

1. **Reduced cognitive overhead** — developers encounter the same patterns, exception types, and project structure across services.
2. **Code sharing** — makes it easier to move developers between services and share code such as common exception classes or shared Pydantic models.
