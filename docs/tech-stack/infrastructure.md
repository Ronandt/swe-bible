---
id: infrastructure
title: Infrastructure Tools
sidebar_label: Infrastructure
sidebar_position: 7
---

# Infrastructure Tools

| Component | Technology |
|-----------|-----------|
| **Platform** | OpenShift / Kubernetes / Docker |
| **Packaging** | Helm Charts |
| **CI/CD** | GitHub Actions / GitLab CI / ArgoCD |

![Infrastructure overview](/img/image14.png)

Infrastructure is used to emulate the production environment and simulate how all components interact with one another in production, as well as the management of secrets and variables.

## Platform — OpenShift

As the production environment uses OpenShift, it is **strongly recommended** to use OpenShift to build your application through Helm Charts.

:::note
OpenShift requires at least **32 GB of RAM** and **Windows Education/Enterprise** as the operating system.
:::

[Download OpenShift (Red Hat)](https://developers.redhat.com/products/openshift/download)

You may test Helm charts with Kubernetes if you have trouble using OpenShift.

## Packaging — Helm Charts

**Helm is required for production.** You will need Helm charts and umbrella charts as material for your RFO before deploying to production.

[Helm Documentation](https://helm.sh/)

See the [Helm Charts section in Deployment](../deployment/helm-charts) for detailed Helm chart setup and examples.

## CI/CD

### For Development — CI (Checks)

Use **GitHub Actions** to check for code smells and security issues (using Trivy and SonarQube). This ensures code quality is consistently maintained throughout the team.

[GitHub Actions](https://github.com/features/actions)

### For Production — CD (Monitoring)

In production, **ArgoCD** is used along with OpenShift. It:
- Continuously monitors running applications and checks their health
- Syncs with the latest repository
- Automatically deploys containers using OpenShift

[ArgoCD Installation](https://argo-cd.readthedocs.io/en/stable/operator-manual/installation/)
