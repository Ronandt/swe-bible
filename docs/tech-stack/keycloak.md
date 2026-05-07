---
id: keycloak
title: Keycloak
sidebar_label: Keycloak
sidebar_position: 4
---

# Keycloak

| Setting | Value |
|---------|-------|
| **IdP (Identity Provider)** | Keycloak |
| **Realm** | One realm (assume anybody can access the realm) |
| **Groups** | Min. one group per application |
| **Backend Client** | Confidential Client (only if backend needs to interact directly with Keycloak) |
| **Frontend Client** | Public Client |
| **Roles** | Separate Admin/User roles — **ONLY USE client roles** |
| **Redirect** | Only necessary application endpoints |
| **SSL** | Recommended for development — **Required for production** |
| **Custom Attributes** | If needed |

- [Install Keycloak](https://www.keycloak.org/getting-started/getting-started-zip)
- [Keycloak Tutorial (Realm, Confidential Clients, Public Clients)](https://www.youtube.com/watch?v=fvxQ8bW0vO8)
- Related libraries: [python-keycloak](./backend#authentication-adapter--python-keycloak) · [keycloak-js](./frontend#authentication-adapter--keycloak-js)

## About Keycloak

![Keycloak overview](/img/image6.png)

Keycloak is an open-source Identity and Access Management solution providing authentication, authorisation, and user management for applications. **Because applications in the production environment can be accessed by anybody**, it is **important to secure your entire application using Keycloak and enforce mandatory login upon visiting the website.**

Keycloak is chosen as the IdP because it is the de facto authentication provider for production. **Keycloak uses JWT** as the mechanism for communicating identity and claims between the IdP and your application.

Install the local version for development: [OpenJDK - Keycloak](https://www.keycloak.org/getting-started/getting-started-zip)

## Naming Conventions

| Entity | Convention |
|--------|-----------|
| **Realm** | `yourprojectname-realm` |
| **Group** | `yourprojectname-app-nameofgroup` |
| **Backend Client** | `yourprojectname-backend-client` |
| **Frontend Client** | `yourprojectname-frontend-client` |
| **Roles** | `yourprojectname-nameofyourrole` |

All clients, realms, and roles should use **kebab-case + all lowercase** with your project's name at the start. This ensures developers can onboard quickly when switching between projects.

## How Keycloak is Managed in Production

![Keycloak managed in production — group membership gating](/img/image7.png)

In production, Keycloak is a **shared platform administered by the platform team** — not by individual application teams. A single **realm** hosts all applications, each registered as a separate **client**. Your application is one tenant among many.

**Key facts:**
- Users are pre-provisioned (synced from LDAP/Active Directory, or created by platform admins)
- Your application **never creates, modifies, or deletes users** — it only reads what the JWT token says
- Access is gated by **group membership** — each application has a designated group; if a user isn't in it, they're turned away
- Your backend should enforce this by inspecting the `groups` claim in the JWT
- What a user can do is controlled by **client roles** (scoped to your application's client ID)

This gives three distinct layers, each with a clear owner:

![Three distinct Keycloak layers](/img/image8.png)

1. **Keycloak layer** — configured by the platform team; you interact with its output (the token), not its internals
2. **Group membership layer** — your application owns this: who can enter your app
3. **Role-based permissions layer** — your application owns this: what actions users can take

## Token-Based Auth Architecture Flow

**Keycloak** — identity provider issuing tokens  
**Frontend** — obtains tokens and attaches them to requests *(where the Public Client is used)*  
**Backend** — verifies tokens, enforces roles/permissions *(no Confidential Client needed for verification)*

### Login Flow

![Request handshake between frontend, backend and Keycloak](/img/image9.png)

Login is **not** handled by your application. When an unauthenticated user visits the app:
1. The frontend redirects them to Keycloak's hosted login page
2. Your app never sees the user's credentials
3. Keycloak handles the entire login and redirects back to your app with tokens attached

Keycloak issues two tokens:
- **Access token** — short-lived JWT used to authenticate API requests
- **Refresh token** — longer-lived, used solely to obtain a new access token when the current one expires

The frontend stores both and is responsible for checking token expiry **proactively** — before sending a request, not after receiving a 401. `keycloak-js` handles this transparently if you initialise it with `onTokenExpired`.

### Request Verification

![Token flow — proactive refresh before sending requests](/img/image10.png)

For every subsequent API request, the frontend attaches the access token in the `Authorization` header as a Bearer token. The backend validates it — **not by calling Keycloak on every request**, but by verifying the token's signature using Keycloak's public key (fetched once on startup).

Validation checks four things:
1. **Signature** — was this issued by our Keycloak?
2. **Issuer** (`iss` claim)
3. **Expiry** (`exp` claim)
4. **Audience** (`aud` claim — should match your client ID)

All four must pass. If valid and the user has the required group membership and client roles, the backend returns the data. Otherwise it returns `401` (invalid/expired token) or `403` (valid token, insufficient permissions).

![Backend validates token locally using public key — four checks must pass](/img/image11.png)

:::caution
A revoked token can still pass validation until it expires. This is why access tokens are kept short-lived (typically 5–15 minutes) and why the refresh token exists.
:::

## Realm

A realm secures and manages metadata for a set of users, applications, and registered OAuth clients. For production, **multiple applications are tenants of one realm** — keep to client-scope roles and permissions. Use **GROUPS** to prevent users from other applications from accessing yours.

## Groups

Since a single production realm contains all users across all applications, roles alone are not sufficient to restrict access to specific applications. Use **Keycloak Groups** to organise users by the application(s) they are permitted to access.

- Assign users to groups corresponding to the applications they should access (e.g. `yourprojectname-app-users`)
- Groups should be **included in the JWT token** via a Group Membership mapper
- The backend should validate **both** the role (what the user can do) and the group (which app they belong to) on each request

## Frontend Client (Public Client)

Browser-based applications cannot store secrets safely — anything bundled into the frontend is readable by anyone. **Public clients authenticate without a client secret**, using the PKCE authorisation code flow instead.

**PKCE Flow:**
1. The frontend redirects the user to Keycloak's hosted login page
2. After authentication, Keycloak redirects back with a short-lived, one-time authorisation code
3. The frontend exchanges that code for an access token and a refresh token

:::tip
**You do not need to implement any of this manually.** `keycloak-js` handles the entire PKCE flow when you initialise it — including token storage, proactive refresh before expiry, and redirect handling.
:::

## Backend Client (Confidential Client)

A backend confidential client is needed **only** when the backend itself needs to call Keycloak's endpoints directly.

**Standard OIDC operations (allowed in production):**
- Token exchange, token refresh, token introspection, logout
- Uses Keycloak's OpenID Connect token endpoint and requires the client secret

**Administrative operations (development/testing only):**
- Creating/deleting users, assigning roles, reading realm configuration
- Requires Service Accounts enabled with realm-management roles (e.g., `manage-users`)
- **You do not have administrative operations in Keycloak (production)**

![Confidential client — backend interactions with Keycloak](/img/image12.png)

Use **python-keycloak** for confidential clients in the backend.

## Roles

If you require users to be split between different permissions (e.g., admin and normal users), use roles. You will also need to:
- Hide UI from non-admin users
- Secure your backend by checking valid users and user roles
- Use `keycloak-js` to check for user roles on the frontend
- Decrypt using the JWT library in the backend to check roles

:::important
**The production environment only accepts client roles** — do not use Realm roles. This is because multiple unrelated applications share the same realm as tenants.
:::

## Redirects

Only set the destinations you are going to redirect to and from (e.g., frontend to Keycloak login, and Keycloak login back to frontend). **You should not allow any other websites to redirect to your Keycloak login.**

## SSL

SSL is only required in production environments, but it is best practice to run a mock or staging server that enforces SSL as well. **There is a difference not just in configuration but in code if you want to introduce certificates.**

[Configure SSL on Keycloak](https://www.youtube.com/watch?v=WAgHhRgqkFM)

## Custom Attributes

If you require additional user data (e.g., birthday, family, etc.), **use Keycloak's additional attributes. You should not maintain a separate custom database for user information.** At most, you may store the user ID in your backend to reference related data, but all personal attributes should remain in Keycloak.
