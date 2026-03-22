# Drizzle Format — Implementation Guide

## Quick Reference

| Aspect | Convention |
| ------ | ---------- |
| Language | TypeScript |
| File extension | `.ts` |
| Module system | ES modules |
| Property naming | `camelCase` |
| Column naming | `snake_case` (string args) |
| Table naming | `snake_case` |
| ID type | `uuid("id").primaryKey().defaultRandom()` |
| Timestamps | `timestamp("col", { withTimezone: true })` |

## Key Rules

1. **Property names** are `camelCase`, column name strings are `snake_case`.
2. **Imports** — `pgTable`, `uuid`, `text`, etc. from `"drizzle-orm/pg-core"`. The `sql` helper from `"drizzle-orm"`.
3. **References** — `.references(() => otherTable.id, { onDelete: "cascade" })` — use real imports, not `import type`.
4. **Timestamps** — `timestamp("column_name", { withTimezone: true })`.
5. **Array defaults** — `.default(sql\`'{}'\`)` — not `.default({})`.
6. **Bigint mode** — `bigint("col", { mode: "number" })` unless value exceeds JS safe integer range.

## File Template

```typescript
// {table_name}: Brief description of the table.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const tableName = pgTable(
  "table_name",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"), // Nullable (no .notNull())
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_table_name_user_id").on(table.userId),
  ]
);
```

## Column Types

| Pseudo Code | Drizzle Type | Import |
| ----------- | ------------ | ------ |
| `string` | `text("col")` | `text` |
| `integer` | `integer("col")` | `integer` |
| `bigint` | `bigint("col", { mode: "number" })` | `bigint` |
| `boolean` | `boolean("col")` | `boolean` |
| `decimal` | `numeric("col")` | `numeric` |
| `uuid` | `uuid("col")` | `uuid` |
| `json` | `jsonb("col")` | `jsonb` |
| `timestamp` | `timestamp("col", { withTimezone: true })` | `timestamp` |
| `enum(...)` | `pgEnum("name", [...])` | `pgEnum` |
| `text[]` | `text("col").array()` | `text` |

## Indexes and Constraints

```typescript
// In the table callback:
(table) => [
  // Standard index
  index("idx_table_field").on(table.field),

  // Composite index
  index("idx_table_a_b").on(table.fieldA, table.fieldB),

  // Unique constraint
  unique("uq_table_field").on(table.field),

  // Composite unique
  unique("uq_table_a_b").on(table.fieldA, table.fieldB),
]
```

## Enums

```typescript
import { pgEnum } from "drizzle-orm/pg-core";

export const tableStatusEnum = pgEnum("table_status", [
  "active",
  "inactive",
]);

// Use in table:
status: tableStatusEnum("status").notNull().default("active"),
```

## Gotchas

- **Array defaults** — Use `.default(sql\`'{}'\`)` with `sql` imported from `"drizzle-orm"`. `.default({})` generates invalid SQL.
- **Bigint mode** — Use `{ mode: "number" }` to get JS numbers instead of BigInt. Only use `{ mode: "bigint" }` when values exceed `Number.MAX_SAFE_INTEGER`.
- **Import real tables** — `import { users } from "./users"` (not `import type`). Drizzle needs runtime references for FK resolution.
- **`.notNull()` is the default-off** — Fields are nullable by default in Drizzle. Add `.notNull()` for required fields.
- **Don't create an index on a column that has `.unique()`** — Drizzle/PostgreSQL creates one automatically.
- **Don't index the leading column of a composite unique/index separately.**
- **Timestamp timezone** — Always use `{ withTimezone: true }` to match PostgreSQL `TIMESTAMPTZ`.
