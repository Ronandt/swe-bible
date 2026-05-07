---
id: developer-roles
title: Developer Roles & Responsibilities
sidebar_label: Developer Roles
sidebar_position: 3
---

# Developer Roles & Responsibilities

Based on the stack, developer roles can be roughly divided into three roles. Although ideally a full-stack developer should have the ability to do all three, the amount of technologies and tools involved — coupled with the short lifecycle of the average developer — makes it unreasonable to expect all three unless the developer has prior experience.

If a developer has a certain level of competency, they may take up more than one role.

---

## Backend Developer

A backend developer should be able to:

- Architecture of the backend APIs
- Understand all the technologies listed in the **backend section** of the stack
- Integrate APIs with mock managed services (Database, Keycloak, and S3 / Object Storage)
- Document the backend (e.g. Swagger API) for frontend developers and DevOps engineers
- Basic understanding of how the frontend works (how the frontend sends requests, how the backend responds, and how they integrate)
- Liaise with the frontend developers on API needs
- **Know how env management works in production (`secrets.yaml` + `values.yaml`) and how it's piped into the application**
- **Liaise with the DevOps engineer to define, validate, and document all configuration values and secrets required by the application (critical for production), enabling accurate creation of `values.yaml` and `secrets.yaml`**

---

## Frontend Developer

A frontend developer should be able to:

- Understand UI/UX patterns and users' requirements
- Use UI/UX design tools such as Figma and create high-fidelity prototypes for the client
- Architecture of the frontend
- Understand all the technologies listed in the **frontend section** of the stack
- Liaise with the backend developers for API needs
- Basic understanding of how the backend works (how the frontend sends requests, how the backend responds, and how they integrate) — be able to read documentation from the backend developer
- **Know how env management works in production (`secrets.yaml` + `values.yaml`) and how it's piped into the application**
- **Liaise with the DevOps engineer to define, validate, and document all configuration values and secrets required by the application (critical for production), enabling accurate creation of `values.yaml` and `secrets.yaml`**

---

## DevOps Engineer

A DevOps engineer should be able to:

- Understand the entire overarching architecture of the application (including how Docker containers and managed services are orchestrated, networked, and configured — e.g., connectivity, ports, and service dependencies)
- Set up CI/CD Pipelines to ensure code quality
- Generate and provide materials needed for deployment, such as Trivy scans, umbrella charts, documentation, and RFO
- Knowledge of Dockerisation
- Set up Helm charts and be able to deploy on Kubernetes and OpenShift
- Set up all services (Database, Keycloak, S3) from scratch, and **configure the settings for the application (Secrets and Values) and configuration in managed services with the help of the backend and frontend developers**

---

## Cross-Team Collaboration

Particularly for deployment, **all parties need to work very closely with one another** to ensure no discrepancies when converting the development environment to a production-ready app. Ideally, there should be a pre-staging environment where all managed services are set up the same way as production, controlled by one server.

As a measure, after the DevOps engineer sets up the OpenShift environment, **all modifications in the architecture in development and all modifications of secret and configuration variables (including name changes) should be clearly notified by the frontend and backend developers to the DevOps engineer.**
