---
id: code-quality-tools
title: Code Quality & Security Tools
sidebar_label: Code Quality & Security
sidebar_position: 8
---

# Code Quality & Security Tools

## Code Quality

![Code quality tools overview](/img/image15.png)

| Tool | Role | Type |
|------|------|------|
| **ESLint** | Frontend Linter | VSCode Plugin + NPM Package |
| **Prettier** | Frontend Formatter | VSCode Plugin + NPM Package |
| **Flake8** | Backend Linter | VSCode Plugin + pip Package |
| **Black** | Backend Formatter | VSCode Plugin + pip Package |
| **SonarLint / SonarQube** | Static Analyser (Code Quality) | VSCode Plugin / CI-CD |

## Security Tools

| Tool | Role |
|------|------|
| **Trivy** | Vulnerability Scanner |
| **SonarQube** | Static Code Analyser |

---

## About Plugins vs. Packages

### Plugins (VSCode Extensions)
Plugins (or extensions) are integrations for your code editor that allow it to interact with the underlying packages. They provide **real-time feedback** — highlighting syntax errors, code smells, formatting issues, and maintainability warnings — directly in the editor.

Plugins do **not** perform the actual linting or formatting themselves. They act as a bridge between the editor and the installed package.

### Packages (npm / pip)
Packages are the actual tools that perform the work — linting, formatting, or static analysis. They are installed in your project via **npm** (frontend) or **pip** (backend).

**Key advantage of packages over plugins:** Packages are project-based, meaning that linting/formatting rules are baked into your project and apply consistently to all developers. **Packages are also integratable with CI/CD pipelines.**

---

## Frontend Linter — ESLint

ESLint identifies and reports on patterns in ECMAScript/TypeScript code. It also supports JSX syntax, allowing standards to be enforced in React code. You can configure ESLint's built-in rules based on the project to standardise code across the team.

- [Download ESLint](https://eslint.org/)
- [VSCode Plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [ESLint Tutorial](https://www.youtube.com/watch?v=St1YSNoB36Y&t=39s)

## Frontend Formatter — Prettier

Prettier is the most popular frontend formatter for HTML, CSS, JS, and JSX (React). It automatically formats code based on the configuration, reducing the burden on developers. Although linters can format code, **Prettier is more opinionated**.

- [Download Prettier](https://prettier.io/docs/install)
- [VSCode Plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode&ssr=false#overview)
- [Prettier Tutorial](https://www.youtube.com/watch?v=DqfQ4DPnRqI)

## Backend Linter — Flake8

**Flake8** enforces PEP8 coding standards and detects common issues such as unused imports, undefined variables, and stylistic inconsistencies.

- [Flake8 VSCode Plugin + Package](https://marketplace.visualstudio.com/items?itemName=ms-python.flake8)

## Backend Formatter — Black

**Black** automatically reformats Python code according to a standardised style, reducing formatting-related conflicts and improving readability.

- [Black VSCode Plugin + Package](https://marketplace.visualstudio.com/items?itemName=ms-python.black-formatter)

## Static Analyser — SonarLint / SonarQube

SonarLint/SonarQube detects code quality issues, bugs, and security vulnerabilities in real time during development and during CI/CD. It directly integrates with VS Code via the SonarLint plugin.

- [SonarLint VSCode Plugin](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

---

## Vulnerability Scanner — Trivy

Trivy scans container images, filesystems, and Git repositories for known security vulnerabilities. It focuses on finding issues in OS packages, language dependencies, and container layers.

:::important
**Trivy reports are required for production** whenever you submit a new container.
:::

[Trivy Getting Started](https://trivy.dev/docs/latest/getting-started/)

## Static Code Analyser — SonarQube

SonarQube analyses the entire application's source code for quality, bugs, security vulnerabilities, and code smells. It works for multiple languages (Python, Java, JS/TS, Go, etc.).

:::important
**SonarQube reports are required for production.** Use SonarQube in your CI (GitHub Actions). Use SonarLint for your text editor.
:::

**SonarQube vs. SonarLint:**
- SonarLint provides local, file-level analysis in the IDE
- SonarQube performs **comprehensive analysis of the entire application** — detecting system-level issues, code duplication, architectural concerns, and security vulnerabilities that span multiple modules or services

Because it analyses the full codebase and produces metrics and dashboards, SonarQube is more resource-intensive — use it only when merging (CI), not on every save.

[Download SonarQube](https://www.sonarsource.com/products/sonarqube/downloads/)
