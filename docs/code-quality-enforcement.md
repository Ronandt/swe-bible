---
id: code-quality-enforcement
title: Enforcing Code Quality
sidebar_label: Code Quality Enforcement
sidebar_position: 6
---

# Enforcing Code Quality & Application Quality

## Overview

![Code quality enforcement — four stages of the development lifecycle](/img/image34.png)

Apart from setting standards and establishing knowledge management, ensuring that these practices are enforced requires concrete measures at different stages of the development lifecycle.

Quality is controlled at four distinct points:

1. **Onboarding Stage**
2. **Development Stage**
3. **Pull Request Stage**
4. **Continuous Deployment Stage (Pre-staging)**

---

## 1. Onboarding Stage

This stage only happens **once** — when a new person joins the team. Before they start, they should:

- Have some basic coding knowledge
- Read this document (tech stack, folder structure, design patterns, branch enforcement) and have a general understanding of it
- Set up their local development environment (text editor, linters, code formatters — covered in the Development Stage section below)
- Complete a walkthrough of template code or create demo code to synthesise all the knowledge here

---

## 2. Development Stage

This stage resides in your local machine and editor. Before you even commit and push, your local tools should be able to tell you about any poor-quality code, poorly formatted code, or code smells.

Tools to use:
- Code formatters (Prettier, Black)
- Linters (ESLint, Flake8)
- Static analysis tools (SonarLint)
- Basic testing / unit testing of new functionality

This reduces the chance of getting the merge/pull request rejected by automated CI review and the senior developer.

### VSCode Workspace Recommendations (`.vscode/extensions.json`)

![Enforcing linters & formatters in the development stage](/img/image35.png)

VSCode Workspace Recommendations is a project-level file committed to the repository containing a list of recommended extensions. When a developer opens the project in VSCode for the first time, VSCode detects this file and **displays a prompt asking them to install the recommended extensions** — keeping the team's editor setup consistent automatically.

### VSCode Extensions

Extensions act as the bridge between the editor and the underlying package. Without the extension installed, VSCode has no way to surface linting errors or trigger formatting. The extension doesn't define rules or perform checks — it simply connects the editor to the package and displays its output inline.

This is why `extensions.json` exists — to ensure every developer has the required extensions installed so that `settings.json` and tool config files can take effect.

### VSCode Workspace Settings (`.vscode/settings.json`)

Project-level configuration files committed to the repository that control how the editor behaves for everyone. They do not add new functionality — instead they configure the installed extensions:
- Enabling ESLint
- Setting Prettier as the default formatter for JS/TS files
- Setting Black as the default formatter for Python files
- Automatically fixing ESLint errors and running the formatter on save

Because they are committed to the repo, **all developers automatically get the same editor behaviour** without manual configuration.

### Tool Config Files

Tool config files such as `.flake8`, `.prettierrc`, `pyproject.toml`, and `eslint.config.js` are separate from VSCode settings. **They define the actual rules and standards that tools enforce** — maximum line length, quote style, which patterns to flag, etc.

These are read directly by the package itself — not by VSCode — meaning they apply consistently whether the tool is run in the editor, the terminal, or the CI/CD pipeline.

---

## 3. Merge / Pull Request Stage

This is the **most important stage** — it involves a lead developer making sure all code is up to standard as a formal review, not just in terms of formatting but the architecture as a whole.

Two types of reviews must happen at this stage:

### Automated CI Review (GitHub Actions)

GitHub will automatically run checks on every PR and block the merge depending on the outcome. This reduces the burden on senior developers by automating routine validation.

**It should check for:**
- Build verifications (app compiles)
- Linting (code quality consistency)
- Static code analysis (ESLint, Flake8)
- Dependency & container vulnerabilities (Trivy)
- Secret scanning (check for API keys)
- Unit tests for individual containers (no regressions) — optional

**It should auto-fix where possible:**
- Formatting issues (automatically correct code formatting violations using Prettier, etc.)
- Trivial code style/naming corrections
- Security & dependency updates (automatically upgrade to newer non-breaking versions)

### Example GitHub Actions Workflow

```yaml
name: Lint & Format Check

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  frontend:
    name: Frontend (ESLint + Prettier)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: architecture-project-frontend

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: architecture-project-frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: ESLint
        run: npm run lint

      - name: Prettier
        run: npx prettier --check .
```

Using GitHub workflows ensures that linting and formatting checks are enforced automatically on every push and pull request, without relying on individual developers to remember to run them locally. When a check fails, GitHub notifies the developer directly with the specific files and lines that failed.

### Senior Developer Reviewer

The senior developer should focus on **higher-level architecture and business logic concerns** that no tool can automatically check.

Responsibilities:
- **Protected branches** for the project (at least one senior developer must review the PR — the author cannot approve their own changes)
- Verify code follows **naming conventions, architectural standards**, with no unreadable/garbage code or exposed sensitive data
- If deemed not up to standard, the senior developer should **reject the merge request**

---

## 4. Continuous Deployment Stage (Pre-staging)

As building all containers using Helm charts is slow, mock-deploying the application from scratch in GitHub Actions is not recommended.

Upon completing one phase of the application — or when the team is confident the architecture is solidified — a developer familiar with DevOps (OpenShift, etc.) should start building Helm charts and RFOs and preparing materials.

Once the Helm charts are done, the developer should be able to trial-deploy onto OpenShift.

:::note
A centralised server is required for this stage. This is a work in progress.
:::
