---
id: logging
title: Logging
sidebar_label: Logging
sidebar_position: 5
---

# Logging

## Why Logs?

![Logging overview — Python logging module for backend, react-toastify for frontend](/img/image33.png)

Logging is an important process in development. It helps developers reduce bugs and find unknown bugs that are not normally spotted. In a production environment, it is especially helpful because **production does not have Inspect Element in the browser for security reasons.**

*Based on the author's experience — you will have a tough time without logs.*

**Recommended tools:**
- **Backend:** Python's native `logging` module
- **Frontend:** `react-toastify` or similar notification libraries (since `console.log` is not accessible in production)

In the future, this may change to more advanced methods such as remote logging (e.g., Sentry).

---

## What to Log — Backend

You should log:

- Every HTTP request (status, data, user agents, etc.)
- Every HTTP response, data, and stack trace (for exceptions)
- Keys & configuration variables and whether they are all present
- Dangerous or persistent operations (e.g., database prepopulation)
- Response times
- Security-related exceptions (invalid tokens, forbidden access)
- Handled exceptions and their reason

---

## What to Log — Frontend

You should log:

- Configuration variables
- Every HTTP request (status, data sent)
- Every HTTP response (status, data received)
- **Runtime errors in UI & API errors caught**
- Mutations in TanStack Query
- Security-related exceptions (invalid tokens, forbidden access)

---

## How to Log

Use **middleware** (as described in the architecture sections) to log every single request and response.

### Request Middleware in Axios (Frontend — runs on every request)

```ts
client.interceptors.request.use((config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || "")
    return config
}, (error) => {
    console.error("[API Request Error]", error)
    return Promise.reject(error)
})
```

### Request Middleware in FastAPI (Backend — runs on every request)

```python
from fastapi import FastAPI
from app.middleware.logging_middleware import logging_middleware

app = FastAPI()

@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s -> %d (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response
```

---

## Future / Potential Extensions

The Python `logging` module allows easy integration with other logging mechanisms, such as:
- Generating `.txt` logs for analysis
- Remote logging with tools like Sentry
- Structured JSON logging for log aggregation platforms

---

## Logging Caveats in Production

- When logging to standard output, there should be an option to enable `debug` mode — check this setting if you cannot log to standard output.
- **There is no way to check `console.log` in production** — the developer needs another method of logging (e.g., toast notifications, backend logs viewed via pod terminal).
