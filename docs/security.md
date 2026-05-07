---
id: security
title: Security
sidebar_label: Security
sidebar_position: 9
---

# Security

## Application Authentication

All backend endpoints enforce strict authentication and authorisation using Keycloak-issued tokens. Every API request must include a valid access token in the **Authorization header**, which the backend decrypts and verifies before processing the request.

The backend checks:
- **Token validity** — ensuring it was issued by Keycloak and has not expired
- **User roles and permissions** — confirming the requester is authorised for the specific endpoint

Requests with invalid, expired, or unauthorised tokens are rejected with **HTTP 401 Unauthorised** or **HTTP 403 Forbidden** responses.

**Best practices:**
- Tokens are verified on every request
- Role-based access control is enforced consistently across endpoints
- Token expiration and refresh mechanisms reduce security risks while maintaining usability
- All communication occurs over HTTPS to protect tokens in transit

Related: [Keycloak Authentication Flow](./tech-stack/keycloak#token-based-auth-architecture-flow)

---

## Configuration & Secret Key Management

### Environment Variable Naming Convention

Environment and secret variables should follow the standard practice of **prefixing by responsibility**.

| Type | Prefix |
|------|--------|
| App | `APP_` |
| Database | `DB_` |
| Auth (Keycloak) | `KC_` |
| Object Storage (S3) | `S3_` |
| Infrastructure | `INFRA_` |

:::important
Variable naming conventions **should not deviate across projects** to ensure developers can work on each other's projects with less friction. Standard credentials (database passwords, authentication keys, S3 secrets) should remain consistent.
:::

### Mandatory Variables

```
APP_ENV=prod
APP_LOG_LEVEL=INFO
APP_API_URL=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

KC_ENDPOINT=
KC_REALM=
KC_CLIENT_ID=
KC_CLIENT_SECRET=

S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

:::note
For the frontend, prefix env variables with `VITE_` in development when using `.env`:
```
VITE_KC_REALM=...
```
:::

### Labelling Secrets vs Configuration

Organise your `.env` file to clearly distinguish secrets from configuration:

```bash
# config
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_db

# secrets
DB_USER=app_user
DB_PASSWORD=secret
S3_SECRET_KEY=...
```

This allows you to properly segment secrets and configuration when moving to staging/production, preventing accidental misclassification.

:::caution
**Never put secrets in the frontend.** This only applies to the backend.
:::

### Storing Secrets — Development

| Secret Type | Storage |
|-------------|---------|
| Secrets (backend only) | `.env` |
| Configuration (backend & frontend) | `.env` |

Store secrets and configuration in `.env`. The file **must be git-ignored** to prevent leakage.

Keep `.env` files **separate** for frontend and backend — there should only be secrets in the backend, never the frontend.

### Storing Secrets — Production

| Secret Type | Storage |
|-------------|---------|
| Secrets (backend only) | OpenShift `secrets.yaml` |
| Configuration (backend & frontend) | `values.yaml` |

When using OpenShift, **git-ignore your `.yaml` files**.

Use `secrets.yaml`/`values.yaml` in `deployment.yaml` so values can be injected. Both frontend and backend should have their own `values.yaml` (and the backend should have a `secrets.yaml`).

---

## Unwanted Privilege Escalation

Unwanted privilege escalation refers to a user getting more access than they are supposed to. This can come in the form of:
- **Horizontal escalation** — getting access to other users' data
- **Vertical escalation** — getting admin access

### Proper Handling of User Access Tokens

Privilege escalation can occur from not properly logging a user out (keeping access tokens in browser cache) or not redirecting them to the login page when accessing pages outside their permission.

**Bad example — promise never resolves, so logout may not complete:**

```ts
export const logout = () => keycloak?.logout()

const logout_b = async () => {
    await toast.promise(
        new Promise(() => {
            logout()  // This promise never resolves!
        }),
        {
            loading: "Logging you out...",
            success: "Successfully logged out!",
            error: "Failed to logout",
        }
    )
}
```

### Keeping Admin Endpoints Open or Unsecured

Security by obscurity is not enough to hide admin endpoints. Tools such as [Gobuster](https://www.kali.org/tools/gobuster/) can easily discover these endpoints.

:::caution
For commercial-scale software, **do not include your admin endpoints in `robots.txt`**. (See [wikipedia.org/robots.txt](https://en.wikipedia.org/robots/robots_txt) as an example of what NOT to do.)
:::

---

## Outdated or Improper Encryption Methods

Most symmetric encryption methods are considered secure because cracking them requires computation that is unfeasible in a reasonable amount of time. **Research on vulnerabilities of encryption algorithms before using them.**

### SHA1

SHA1 was initially used for ensuring data integrity but has been considered insecure due to [collision attacks](https://crypto.stackexchange.com/questions/76941/how-a-chosen-prefix-collision-is-more-useful-than-a-standard-collision-concernin) and chosen-prefix collision attacks.

Example: [SHA-mbles demonstration](http://sha-mbles.github.io/)

### AES-CBC

Modern encryption methods no longer use AES-CBC due to its vulnerability to **bit-flipping attacks**.

[Guide: Attacking AES-CBC](https://zhangzeyu2001.medium.com/attacking-cbc-mode-bit-flipping-7e0a1c185511)

---

## Enforcing Secure Passwords

Always assume the user is not security-conscious — it is your job to make sure data that needs to be secured is secured with a strong password. You can estimate a password's strength by calculating its [Entropy](https://proton.me/blog/what-is-password-entropy).

### Via Keycloak

Keycloak allows you to set password policies. Refer to the [password policy guide](https://wjw465150.gitbooks.io/keycloak-documentation/content/server_admin/topics/authentication/password-policies.html). Ensure the policy forces a strong password.

### Manual Password Comparison

If you ever need to manually implement password login, make sure the language's comparison is constant-time. A simple `==` is vulnerable to [timing attacks](https://www.twingate.com/blog/glossary/timing%20attack). Use [constant-time algorithms](https://medium.com/@ajay.monga73/timing-secrets-exploiting-returns-password-vulnerabilities-and-fix-in-java-d41ed95f8272) instead.

---

## Serialising User Input

**Never assume user input is what you want it to be.** Strings and images uploaded by users must be validated and serialised.

Recent example: [Cloudflare outage caused by unvalidated input (Feb 2026)](https://blog.cloudflare.com/cloudflare-outage-february-20-2026/)

**Bad example — validating file type by extension (easily bypassed):**

```python
if request.file_path.lower().endswith('.jpg'):
    content_type = "image/jpeg"
```

**Good example — validating actual image content:**

```python
from PIL import Image

def is_valid_image_pillow(file_name):
    try:
        with Image.open(file_name) as img:
            img.verify()
            return True
    except (IOError, SyntaxError):
        return False
```

### SQL Injection

Use **SQLAlchemy's ORM** — it parameterises all queries automatically, preventing SQL injection. Never concatenate user input into raw SQL strings.

### C/C++ Format String Vulnerability

User input should never be passed directly into `printf` — this can expose memory addresses when a user inputs format specifiers like `%p`:

```c
// VULNERABLE — do not do this
printf(user_input);

// SAFE
printf("%s", user_input);
```

---

## Other Miscellaneous Security Vulnerabilities

### Buffer Overflow

More relevant to statically typed languages (C, C++). Occurs when a program writes more data to a buffer than it can hold, overwriting adjacent memory. Always validate input lengths and use safe string functions.

See also: [OWASP Top 10 2025](https://owasp.org/Top10/2025/) for a comprehensive list of current vulnerabilities.
