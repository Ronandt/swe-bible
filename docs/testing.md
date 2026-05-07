---
id: testing
title: Testing
sidebar_label: Testing
sidebar_position: 8
---

# Testing

## Unit Testing

Unit testing ties into clean architecture. **The cleaner the architecture, the easier it is to test and isolate functionality.** Refer to the [Clean Architecture section](./architecture/overview) on how to make your code clean.

**Backend:** Use `pytest` as the test runner with `unittest.mock` for mocking external dependencies. See the [Backend Tech Stack](./tech-stack/backend#testing--pytest--unittest) for library details.

**Frontend:** Use `Vitest` — well integrated with Vite, faster than Jest. See the [Frontend Tech Stack](./tech-stack/frontend#testing--vitest) for library details.

## Penetration / Security Testing

Penetration testing finds loopholes in the software and is usually done by a dedicated group with **no prior knowledge of the software architecture**. All developers should always keep security considerations and vulnerabilities in mind.

Most common security vulnerabilities in 2025: [OWASP Top 10 2025](https://owasp.org/Top10/2025/)

## Load Testing

During development, the scaling of the system must also be taken into consideration.

Services such as [Redis](https://redis.io/) can greatly improve user data access speeds, but the database must fit into memory. Redis can also implement sharding, but it must be supported by your application. It can also behave as a reverse proxy.

Consider using tools like **k6** or **Locust** to automate load testing, and **Prometheus** to get CPU and memory usage values.

## Integration Testing

:::note
Integration testing documentation is a work in progress.
:::

## User Acceptance Testing

:::note
User acceptance testing documentation is a work in progress.
:::
