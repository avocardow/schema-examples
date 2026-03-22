<!-- After copying this template, delete the README.md files from each format subdirectory -->
<!-- (convex/README.md, sql/README.md, etc.). Those are implementation guides that live only in _template/. -->
<!-- Completed domains contain only schema files in their format directories. -->

# {Domain Name}

> Brief one-line description of what this domain covers.

## Overview

2-3 paragraphs explaining the domain, what real-world applications it supports, and the key design decisions made in this schema.

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for ownership and audit trails |

> If this domain has no external dependencies, state: "This domain is self-contained — no external dependencies."

## Tables

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `example_table` | Brief description |
| 2 | `another_table` | Brief description |

## Pseudo Code

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. example_table

Brief description of what this table stores and why.

```
table example_table {
  id            uuid primary_key default auto_generate
  name          string not_null
  description   string nullable
  status        enum(active, inactive) not_null default active
  metadata      json nullable
  created_at    timestamp default now
  updated_at    timestamp default now on_update

  indexes {
    index(status)
  }
}
```

**Design notes:**
- Why certain fields exist
- Important constraints or business rules

### 2. another_table

```
table another_table {
  id            uuid primary_key default auto_generate
  example_id    uuid not_null references example_table(id) on_delete cascade
  user_id       uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC
  value         string not_null
  created_at    timestamp default now

  indexes {
    index(example_id)
    index(user_id)
    composite_unique(example_id, user_id)  -- One per user per example
  }
}
```

<!-- Repeat for all tables -->

## Relationships

```
example_table    1 ──── * another_table     (one example has many related records)
users            1 ──── * another_table     (one user owns many records)
```

## Best Practices

- **Soft deletes**: Consider whether this domain needs soft delete support (`deleted_at` timestamp) vs hard deletes with cascade
- **Audit trails**: If operations need to be auditable, add an activities/audit table (append-only)
- **Access control**: Reference the Auth / RBAC domain for permission checks rather than duplicating authorization logic

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | 🔲 Todo |
| SQL         | 🔲 Todo |
| Prisma      | 🔲 Todo |
| MongoDB     | 🔲 Todo |
| Drizzle     | 🔲 Todo |
| SpacetimeDB | 🔲 Todo |
| Firebase    | 🔲 Todo |
