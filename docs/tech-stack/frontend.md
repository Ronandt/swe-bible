---
id: frontend
title: Frontend
sidebar_label: Frontend
sidebar_position: 3
---

# Frontend

| Component | Technology |
|-----------|-----------|
| **Programming Language** | TypeScript (6+) |
| **Build Tool** | Vite |
| **UI Framework** | React 19 |
| **UI Navigation** | React Router |
| **HTTP Client** | Axios |
| **Client-Side Data Fetcher & State Manager** | TanStack Query |
| **Component Library** | ShadCN |
| **Style Library** | TailwindCSS |
| **Authentication Adapter** | Keycloak-js |
| **Testing** | Vitest |

## Responsibilities of the Frontend

- Presents the user interface and user experience
- Collects user input and sends requests to the backend API along with the **Keycloak token**
- Performs **UI-only validation** (e.g., required fields, input formatting, basic client-side feedback)
- Renders backend responses and error states
:::danger
The frontend must **not** contain business logic or authorisation decisions, and must **not** directly access the database, modify object storage, or call Keycloak administrative APIs.
:::
- Only interacts with Keycloak for login and retrieval of tokens
- Only calls GET requests using **Presigned URLs** to object storage

## Programming Language — TypeScript

TypeScript was chosen because it is widely used in frontend development and the de facto language in React. It is strongly typed, reducing runtime errors compared to JavaScript, and its ecosystem and community support make it easy to onboard new developers.

- [Download Node.js](https://nodejs.org/en/download)
- [JavaScript Tutorial](https://javascript.info/)
- [TypeScript Tutorial](https://www.youtube.com/watch?v=d56mG7DezGs)
- [TypeScript with React Tutorial](https://www.youtube.com/watch?v=xTVQZ46wc28)

## Build Tool — Vite

**Vite** should be used instead of Create React App (CRA). Vite is a modern build tool emphasising speed and efficiency, providing fast hot module replacement (HMR), optimised bundling, and smooth development workflows.

*Based on author experience: CRA can take up to 20 seconds to build and run the app, while Vite takes at most 2 seconds.*

[Setup React with Vite](https://www.youtube.com/watch?v=jufPO-r6bt0)

## UI Framework — React

React is a widely used, component-based frontend library for building dynamic, interactive UIs. Its state-first approach makes managing JSON data from the backend easier to express. React has a robust library ecosystem with extensive community support.

- [Creating a React App](https://react.dev/learn/creating-a-react-app)
- [React Tutorial — Fundamentals](https://www.youtube.com/watch?v=SqcY0GlETPk)

## UI Navigation — React Router

React Router is used for navigation because it integrates seamlessly with React SPAs. Since React is treated as a single-page application (SPA), navigation doesn't behave like traditional multi-page sites — clicking a link does not reload the page.

:::warning
**Without navigation, reloading the page will not preserve your current location — it will go back to the home page.**
:::

React Router enables dynamic routing within the SPA, managing nested routes and maintaining browser history without full page reloads.

[React Router Tutorial](https://www.youtube.com/watch?v=oTIJunBa6MA)

## HTTP Client — Axios

Axios is a promise-based HTTP client that simplifies communication with backend APIs. It provides a straightforward API for sending requests and handling responses, supports request/response interceptors, automatic JSON parsing, and easy configuration of authentication headers.

[Axios vs Fetch Comparison](https://stackoverflow.com/questions/40844297/what-is-difference-between-axios-and-fetch)

## Component Library — ShadCN/UI

ShadCN/UI is a collection of accessible, reusable components built on Radix UI primitives. Unlike traditional component libraries, **it is not installed as a dependency** — components are copied directly into your codebase, giving you full ownership and control to customise them.

Each component uses **Tailwind CSS** for styling, making it easy to adapt to any design system. ShadCN enables consistent components across multiple applications.

:::tip
Because ShadCN copies components into your codebase rather than installing them as a package, you have full ownership — customise freely without fighting library abstractions.
:::

- [ShadCN Introduction](https://ui.shadcn.com/docs)
- [ShadCN Tutorial](https://www.youtube.com/watch?v=Yz3Rfn_UJOo)

## Style Library — TailwindCSS

Tailwind CSS is a utility-first CSS framework that lets you style elements directly in markup using small, composable class names (e.g., `flex`, `p-4`, `text-sm`). This approach keeps styles co-located with markup, eliminates unused CSS automatically, and makes it easy to build consistent UIs.

- [Tailwind Installation (v4)](https://www.youtube.com/watch?v=sHnG8tIYMB4)
- [Tailwind Tutorial](https://youtube.com/playlist?list=PL6xV3OpvkyrjNk-oqTm-IW5Lx6LOiwINh)
- [Tailwind Documentation](https://v2.tailwindcss.com/docs)

## Client State Fetcher & State Manager — TanStack Query

TanStack Query handles asynchronous data fetching, caching, and state management in React applications. It keeps UI components clean by separating API interface logic from presentation, automatically handling loading, errors, and cache updates.

:::tip
TanStack Query replaces `useEffect` for data fetching. Do not manually fetch data inside `useEffect` — use `useQuery` and `useMutation` instead.
:::

It acts as the bridge for data (requests and responses) between React and the API world.

[TanStack Query Tutorial](https://www.youtube.com/watch?v=mPaCnwpFvZY)

## Authentication Adapter — Keycloak-js

When using Keycloak, use the `keycloak-js` library. **Instead of managing access tokens and refresh tokens manually with LocalStorage or SessionStorage, keycloak-js handles token management and user redirection automatically.** It also provides:

- Out-of-the-box user information retrieval (no manual JWT decoding)
- Role-based access control simplification
- Token expiration handling and silent token refresh
- Single sign-on (SSO) across multiple applications

keycloak-js can reduce boilerplate code from a few hundred lines down to only dozens.

[Keycloak-js with Vite + React](https://www.youtube.com/watch?v=5z6gy4WGnUs)

## Testing — Vitest

Vitest is a frontend unit testing library that integrates well with Vite. It is more flexible and faster compared to Jest, and can be tested directly in the browser.

[Vitest Tutorial](https://www.youtube.com/watch?v=XdDZKeM5_pQ)
