---
id: frontend-architecture
title: Frontend Clean Architecture
sidebar_label: Frontend Architecture
sidebar_position: 3
---

# Frontend Clean Architecture

## Overview

![Frontend architecture overview](/img/image25.png)

![Frontend layer breakdown — core, features, shared](/img/image26.png)

Although the entire frontend is categorised as the UI layer in the general application architecture, it should also be internally split between layers to maintain consistency with the backend.

Inspired by [bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md), the layers in specific features should not be shared amongst other features. If you need to share functionality with other features, put it in the `shared` folder to signal to your team that it may affect multiple dependencies.

---

## Feature Grouping

![Feature grouping — group by user goal, not by technical role](/img/image27.png)

Features should be split based on how much they affect one another. A feature represents a cohesive unit of user-facing functionality that can evolve largely independently.

A single feature may span multiple pages, routes, services, hooks, and UI components. These elements are grouped together not because **they share a technical role**, but because they **change together and serve the same user goal**.

**Example 1:** Authentication (login and register) — the user's goal is to gain access to the system. Both pages use similar services and affect each other, so they belong to one `authentication` feature.

**Example 2:** Viewing users — you might want to view one user or an overview, but both pages serve the same use case:

```
└── pages/
    └── UsersPage.jsx
    └── ViewUserPage.jsx
```

---

## Frontend File Structure

```
architecture-project-frontend/
│
├── src/
│   │
│   ├── assets/                          # Static assets (images, icons, fonts)
│   │   └── react.svg
│   │
│   ├── main.tsx                         # Application entry point
│   ├── index.css                        # Global base styles
│   ├── App.css                          # App-level styles
│   │
│   ├── router/                          # Route definitions
│   │   └── index.tsx
│   │
│   ├── core/                            # App infrastructure — bootstraps the entire application
│   │   ├── api/                         # Shared HTTP client
│   │   │   └── client.ts
│   │   ├── auth/                        # Authentication setup (Keycloak)
│   │   │   ├── AuthProvider.tsx
│   │   │   └── keycloak.ts
│   │   ├── components/                  # App-level structural components
│   │   │   ├── NavBar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AdminRoute.tsx
│   │   ├── providers/                   # Global React context providers
│   │   │   └── AppProviders.tsx
│   │   └── types/                       # Shared TypeScript types and interfaces
│   │       ├── api.ts
│   │       └── auth.ts
│   │
│   ├── features/                        # Feature-based modules
│   │   ├── items/
│   │   │   ├── components/              # Feature-specific UI components
│   │   │   │   └── ItemCard.tsx
│   │   │   ├── hooks/                   # Feature-specific hooks (TanStack Query)
│   │   │   │   └── useItems.ts
│   │   │   ├── services/                # Client-side business logic
│   │   │   │   ├── itemsService.ts
│   │   │   │   └── itemsService.test.ts
│   │   │   └── pages/                   # Route-level components
│   │   │       ├── DashboardPage.tsx
│   │   │       └── ItemDetailPage.tsx
│   │   │
│   │   └── users/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── pages/
│   │
│   └── shared/                          # Reusable code shared across features
│       ├── components/                  # Custom generic UI components + shadcn/ui primitives
│       │   ├── PageHeader.tsx
│       │   └── ui/                      # shadcn/ui primitives — managed by the shadcn CLI
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       └── ...
│       ├── hooks/                       # Custom generic hooks
│       │   ├── useDebounce.ts
│       │   └── use-mobile.ts            # shadcn/ui — do not edit manually
│       ├── lib/                         # shadcn/ui utilities — do not edit manually
│       │   └── utils.ts
│       └── utils/                       # Pure helper functions
│           └── formatDate.ts
│
├── package.json
├── package-lock.json
└── .env
```

### Folder Explanations

| Folder | Purpose |
|--------|---------|
| `src/core` | Everything the application needs to start — auth, HTTP client, global providers, routing guards, shared types. Nothing feature-specific lives here. Features must NOT be imported by core. |
| `src/core/api` | Shared Axios client used by all feature services. Base URL, authentication headers, and interceptors are set up here only. |
| `src/core/auth` | All authentication infrastructure. `keycloak.ts` initialises the Keycloak instance. `AuthProvider.tsx` wraps the app in a React context. Nothing outside of `core/auth` should interact with Keycloak directly. |
| `src/core/components` | App-level structural components — `NavBar`, `ProtectedRoute`, `AdminRoute`. |
| `src/core/providers` | Composes all global React context providers into a single wrapper mounted at the application root. |
| `src/core/types` | Shared TypeScript types and interfaces used across the application. Types here must NOT be feature-specific. |
| `src/features/<feature>` | Each feature is a self-contained module. Features may import from `core`, `shared`, and `components/ui`, but must NOT import from other features. |
| `src/features/<feature>/services` | Client-side business logic — calls `core/api`, transforms/normalises response data before it reaches the UI. |
| `src/features/<feature>/pages` | Page-level components corresponding to application routes. Must NOT call the API directly. |
| `src/features/<feature>/components` | Presentational UI components specific to this domain. Must NOT perform API calls or contain business logic. |
| `src/features/<feature>/hooks` | Custom hooks for data fetching, caching, mutation handling, error state, and loading state. TanStack Query hooks live here. |
| `src/shared` | Reusable code not tied to any feature and not application infrastructure. Must be generic enough to be used by any feature. |
| `src/shared/components/ui` | Auto-generated shadcn/ui primitives — **do not hand-edit**. Add new primitives with `npx shadcn add <component>`. |
| `src/router` | All application routes in one place. Maps URL paths to page-level components and applies routing guards. |

---

## Feature-Based Routing Architecture

![Feature-based routing — route paths mirror the feature directory structure](/img/image28.png)

Routing (using React Router) should be based on your features/feature directory. For example, if your pages are:

```
├── features/
│   ├── users/
│   │   └── pages/
│   │       ├── UsersList.jsx
│   │       └── ViewUserPage.jsx
```

Routes should be:

```tsx
{ path: "/users", element: <UsersList /> },
{ path: "/users/:id", element: <ViewUser /> },
```

This approach keeps related pages and logic together, makes routes **predictable and discoverable**, and aligns feature directories with URL paths — reflecting the domain logic of your application.

---

## Authentication Architecture

### Authentication Through Routes

![Authentication through routes](/img/image29.png)

Implement authentication guards through routing — it is the most idiomatic and cleanest way to enforce authentication in your application.

### Authentication Guards With Proxy Pattern

By wrapping `AppLayout` in a custom `ProtectedRoute` component at the top level, every child route inherits the authentication guard automatically.

```tsx
export const router = createBrowserRouter([
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <DashboardPage /> },
      // ...
    ],
  },
])
```

`ProtectedRoute` works by consuming the `AuthProvider` React Context and resolves into one of three states:

![ProtectedRoute internal mechanism — loading, access denied, authorised](/img/image30.png)

- **Loading** — Keycloak is still initialising, a spinner is shown
- **Access denied** — authenticated but not in the required group, an error screen is shown
- **Authorised** — user passes all checks and the page renders

### Accessing Auth Information Through AuthProvider (Context)

`AuthProvider` should allow access to authentication information across the entire React tree:

```tsx
const value: AuthContextValue = {
    isAuthenticated,
    isAuthorized,
    isAdmin,
    isLoading,
    userInfo: userInfo as Record<string, unknown> | null,
    token: keycloak.token,
    login: () => keycloak.login(),
    logout: () => keycloak.logout(),
}
```

Any component can then access auth state without prop drilling:

```tsx
export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAdmin } = useAuth()
    if (!isAdmin) {
        return (
            <div>
                <h1>Access Denied</h1>
                <p>You need admin permissions to view this page.</p>
            </div>
        )
    }
    return children
}
```

### Types and Interfaces for Type-Safety

Shared types live in `core/types/`:

```ts
export interface AuthContextValue {
    isAuthenticated: boolean
    isAuthorized: boolean
    isAdmin: boolean
    userInfo: Record<string, unknown> | null
    token: string | undefined
    login: () => void
    logout: () => void
}
```

Feature-specific types live alongside the feature they belong to:

```ts
// features/items/services/itemsService.ts
export interface ItemResponse {
    id: number
    title: string
    description: string
    owner_id: string
    image_url: string | null
}
```

When the backend changes a response shape, TypeScript surfaces every affected call site immediately — types make hooks and components self-documenting.

---

## Concrete Code Example — All Layers

![Frontend architecture layers — API → Service → Hook → Page → Component](/img/image31.png)

### API Layer (`core/api/client.ts`)

```ts
apiClient.interceptors.request.use((config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
})
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            keycloak.login()
        }
        return Promise.reject(error)
    }
)
```

The client is the sole communicator from the frontend to the backend. All requests should go through the client. The API layer should NOT be used directly in pages — use it in services.

### Service Layer (`features/<feature>/services/itemsService.ts`)

```ts
export async function uploadItemFile(itemId: string | number, file: File): Promise<{ url: string }> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await apiClient.post<{ url: string }>(`/items/${itemId}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
}
```

The service wraps the API call, sets the correct headers, and maps the response. It has no knowledge of React, state, or the UI.

### Hook Layer (`features/<feature>/hooks/useUploadItemFile.tsx`)

```ts
export function useUploadItemFile(itemId: string | undefined) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (file: File) => uploadItemFile(itemId!, file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
    })
}
```

The hook bridges the service and the page — wrapping service calls in TanStack Query and exposing React state (data, loading, error).

### Component Layer (`features/<feature>/components/ItemImageUpload.tsx`)

```tsx
export function ItemImageUpload({ isPending, hasImage, onChange }: ItemImageUploadProps) {
    return (
        <label className={`... ${isPending ? 'opacity-50 pointer-events-none' : 'hover:border-primary'}`}>
            {isPending ? (
                <span>Uploading…</span>
            ) : (
                <span>{hasImage ? 'Replace image' : 'Upload image'}</span>
            )}
            <input type="file" accept="image/*" onChange={onChange} className="hidden" />
        </label>
    )
}
```

Components should be **purely presentational and stateless** — they receive props and render UI. No knowledge of TanStack Query, services, or API.

### Page Level (`features/<feature>/pages/itemDetail.tsx`)

```tsx
export default function ItemDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { data: item, isLoading, isError } = useItem(id)
    const upload = useUploadItemFile(id)

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        upload.mutate(file, {
            onSuccess: () => toast.success('Image uploaded successfully'),
            onError: (err) => toast.error('Upload failed', { description: err.message }),
        })
    }

    if (isLoading) return <LoadingSpinner />
    if (isError || !item) return <ErrorAlert message="Item not found" />

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <Card>
                <CardContent>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <ItemImageUpload
                        isPending={upload.isPending}
                        hasImage={!!item.image_url}
                        onChange={handleUpload}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
```

The page uses both the hook and the component — passing state and relevant functions down as props.

---

## Passing State

![Passing state — state flows down as props, callbacks flow down if children need to modify it](/img/image32.png)

In React, state is owned by the closest common ancestor that needs to manage or modify it. State is passed down as props; callback functions are passed down if children need to modify it.

**When components are 3–4 levels deep**, passing props through every intermediate level becomes unwieldy. In that case, **React Context provides a global state** that any component in the tree can read without threading props through every level.

See: [React — Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)

---

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Constants | ALL_CAPS_SNAKE_CASE | `TIMEOUT_MAX_SECONDS` |
| Variables | camelCase | `thisIsAVariable` |
| Functions | camelCase | `thisIsAFunction` |
| Classes | PascalCase | `ThisIsAClass` |
| React Components | PascalCase | `ThisIsAReactComponent` |
| Function files | camelCase | `thisIsAFunction.ts` |

---

## Middleware (Axios Interceptors)

Use middleware for functions that need to run on every request/response (e.g., authentication, logging):

```ts
export const apiClient = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)
```

Then import the client into your service.

---

## Handling Errors

Error handling in the frontend is handled at the **page level**. The service and hook layers do not need `try/catch` blocks — if a request fails, TanStack Query catches the error automatically and exposes it through `isError` and `error`.

```ts
const { data, isLoading, isError, error } = useUsers()
if (isError) return <div>{error.message}</div>
```

For mutations, errors are handled inline at the call site via `onError`:

```ts
createItem.mutate(form, {
    onSuccess: () => toast.success('Item created'),
    onError: (err) => toast.error('Error', { description: err.message }),
})
```
