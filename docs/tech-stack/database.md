---
id: database
title: Database
sidebar_label: Database
sidebar_position: 5
---

# Database

| Setting | Value |
|---------|-------|
| **Database** | PostgreSQL 18 |
| **Supplementary Tools** | PgAdmin 4 |
| **Prepopulation of Database** | Not allowed manually |
| **Access** | Only the backend can access the database |

- [PostgreSQL Downloads](https://www.postgresql.org/download/)
- [PgAdmin Download](https://www.pgadmin.org/download/)
- [PgAdmin & Database Administration Tutorial](https://www.youtube.com/watch?v=SpfIwlAYaKk)
- Related libraries: [psycopg](./backend#database-driver--psycopg) · [SQLAlchemy](./backend#orm--sqlalchemy)

## About PostgreSQL

Postgres is an SQL database chosen because it is the managed service used in production. Using it in development reduces the friction between development and production environments.

:::important
If you need to use Postgres in production, **do not bring your own image of Postgres.** Provision it from the production environment and use their credentials.
:::

## Other Tools — PgAdmin

Use PgAdmin to inspect the database or run additional queries during development.

:::note
**Learning SQL is also important** since production does not have PgAdmin for inspection when debugging. The PSQL command line is available in pods, so inspection through the command line is possible.
:::

## Prepopulation of Database

Prepopulation is allowed **only** in Helm charts or done automatically in the application. **It cannot be done manually in the production environment using a script of any kind.**

You may use SQLAlchemy to build all the tables and prepopulate data on application startup. Always check whether the data has already been prepopulated before doing so.

- [Prepopulate Database (StackOverflow)](https://stackoverflow.com/questions/56063458/pre-populate-a-flask-sqlalchemy-database) *(use SQLAlchemy + scope from SQLAlchemy-FastAPI)*
- [Prepopulation Gist Using FastAPI, SQLAlchemy-FastAPI, SQLAlchemy](https://gist.github.com/Ronandt/6c9a160a84d0f114b57bb553458b5822)

## Access

**Only the backend should be able to access the database.** No other entity is allowed to access the database. Hide secrets as much as possible — only the backend should have the credentials.
