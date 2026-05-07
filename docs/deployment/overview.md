---
id: deployment-overview
title: Deployment Overview
sidebar_label: Overview
sidebar_position: 1
---

# Deployment, Initialisation & CI/CD

## Introduction

The deployment process is considerably lengthy. This section aims to accelerate the process by letting the reader know what to prepare beforehand — documents such as Helm chart README, RFO showcase, and other materials.

---

## CI/CD

:::note
There is no central server available for proper CI/CD yet, but this should be written out once it is available.
:::

Key CI/CD setup steps:

- Define the tools used
- Map out the stages: local → development environment → pre-staging → production
- Define triggers (upon merge request, git tag, manually, ArgoCD, etc.)
- Define what runs during the pipeline

**Other guidelines:**
- Learn to do deployments without downtime (blue-green deployment, rolling updates) — not critical for dev but good knowledge
- Practice doing rollbacks, write out the procedure — should also be without downtime
- Should have a central secret store — avoid keeping secrets locally on developers' machines, as they will be forgotten or lost. Look into **Hashicorp Vault** or **Bitwarden**

---

## RFO (Handoff Checklist)

### Things to Submit

```
app/
├── diagrams     (C4 Model Diagram)
├── images       (container images)
├── helm
├── reports      (software evaluation report in TOML format)
└── README.md    (deployment instructions)
```

### CPU & Memory Resource Estimation

- Test to obtain values
- Suggest using **k6** or **Locust** to automate load testing, and **Prometheus** to get CPU and memory usage values

### C4 Model Diagram

![C4 container diagram example](/img/image36.png)

Should be in Drawio or Structurizr format.

Reference: [C4 Container Diagram](https://c4model.com/diagrams/container)

### Security Scanning

Use **SonarQube** or **Trivy**:

- [Trivy container image scanning](https://trivy.dev/docs/latest/guide/target/container_image/)
- Export the report before submission

:::note
Specific export steps are awaiting deployment environment setup.
:::

### No Container Root Access

:::note
Awaiting deployment environment documentation.
:::

---

## During Deployment Checklist

Before going live, check:

- SSL connection is working
- Login and user permissions are correct
- Connectivity of all required services (DB, Keycloak, S3)

---

## Development vs Production Differences

For convenience, here is a summary of differences to keep in mind when moving from development to production:

| Topic | Development | Production |
|-------|-------------|------------|
| **Keycloak SSL** | Optional | **Mandatory** — must mount SSL cert |
| **S3 SSL** | Optional | **Mandatory** — must mount SSL cert |
| **Browser Inspect Element** | Available | **Not available** |
| **Manual scripts** | Allowed | **Not allowed** after deploying the app |
| **Secret keys** | Local `.env` | All keys will be different |
| **Keycloak Realm** | Per-application | Shared platform realm — use groups for app access |
| **Bucket creation** | Manual in client | Created by platform team — no permission to create |

:::important
Make sure you can connect to all endpoints **before** starting deployment.
:::
