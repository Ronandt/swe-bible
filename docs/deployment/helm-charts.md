---
id: helm-charts
title: Helm Charts
sidebar_label: Helm Charts
sidebar_position: 2
---

# Helm Charts

All necessary information can also be found in the [official Helm documentation](https://helm.sh/docs/topics/charts/).

## Why Use Helm Charts?

In deployment, code runs in **pods** — isolated containers that cannot access the host OS. Helm charts can be used to:

- Pass environment variables into containers
- Mount files and secrets so your code can be configured

```
helm/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── configmap.yaml
    └── secret.yaml
```

## Introduction

Create a default Helm chart with:

```bash
helm create <app-name>
```

Helm charts follow YAML syntax:

```yaml
key: value
key2:
  - subKey1: value1
  - subKey2: value2
```

:::warning
**INDENTATION MATTERS IN YAML FILES.**
:::

Helm charts can reference values from other files using double curly braces:

```yaml
ports:
  - port: {{ .Values.service.port }}
```

In this example, `port` refers to `values.yaml` → `service.port`.

You can also specify indentation using `nindent`:

```yaml
labels:
  {{- include "app-backend.labels" . | nindent 2 }}
```

---

## Chart.yaml

The `Chart.yaml` provides the minimum requirements for a Helm chart:

```yaml
apiVersion: v1
name: <my-chart>
version: 0.1.0
appVersion: "0.1.0"
description: Umbrella Helm chart for <my-app> full-stack application
type: application
home: https://example.com

dependencies:
  # Backend chart
  - name: app-backend
    version: "0.1.0"
    repository: "file://charts/backend"
    condition: backend.enabled
  # Frontend chart
  - name: app-frontend
    version: "0.1.0"
    repository: "file://charts/frontend"
    condition: frontend.enabled

maintainers:
  - name: Tan
    email: sample@example.com

deprecated: false
```

| Field | Notes |
|-------|-------|
| `apiVersion` | `v1` for Helm 2.x; use `v2` if the app requires at least Helm 3.0 |
| `version` | Should follow Semantic Versioning |
| `dependencies/repository` | Points to the `Chart.yaml` of each container (frontend, backend) |

---

## values.yaml

The `values.yaml` file is paired with `deployment.yaml` for environment variables and volume mounting of secrets. It acts as shared variables across other YAML files — it is never standalone.

Sample Keycloak configuration:

```yaml
keycloak:
  volumeName: "keycloak-cert"
  mountPath: "/etc/.secrets"
  allowedGroups: "basic-user"
  clientName: "app-client"
```

---

## deployment.yaml

The `deployment.yaml` is container-specific — one deployment file per container. Start with the base configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
  labels:
    {{- include "app-backend.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "app-backend.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "app-backend.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      securityContext:
        runAsNonRoot: true
```

### Passing Environment Variables

After the base configuration, load variables from `values.yaml` as environment variables:

```yaml
spec:
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
            # Keycloak
            - name: KEYCLOAK_CLIENT
              value: {{ .Values.keycloak.clientName }}
```

---

## Mounting Secrets

Reference guide: [A more secure way to handle secrets in OpenShift](https://developers.redhat.com/articles/2025/10/01/secure-way-handle-secrets-openshift#)

### Step 1 — Generate the Secrets

Use the OpenShift Web UI to create a secret with a key and value, or load it using a [secret.yaml](https://docs.redhat.com/en/documentation/openshift_container_platform/3.11/html/developer_guide/dev-guide-secrets).

### Step 2 — Load the Secrets into a Volume

```yaml
volumes:
  - name: {{ .Values.s3.volumeName }}
    secret:
      secretName: {{ .Values.s3.genericSecretName }}
      items:
        - key: <name-of-secret>
          path: app.crt
```

Use references to `values.yaml` for easier configuration and clearer mounts.

### Step 3 — Mount the Cert into the Container

```yaml
volumeMounts:
  - name: {{ .Values.s3.volumeName }}
    mountPath: {{ .Values.s3.mountPath }}
    readOnly: true
```

Setting the file to `readOnly: true` prevents accidental overwriting of file contents.

### Step 4 — Pass Mount Point as Environment Variable

```yaml
- name: <env-variable-name>
  value: {{ .Values.s3.mountPath }}/app.crt
```

Your code can now access the file path of your secret using `env-variable-name`.
