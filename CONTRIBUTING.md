# Contributing to Schema Examples

Thank you for your interest in contributing! This project aims to be the most comprehensive collection of production-ready database schema examples available.

## The Process

Every domain follows the same workflow. Do not skip steps.

### 1. Research

Study real-world products, libraries, and services in the domain. Document findings in a `RESEARCH.md` file inside the domain folder. This file is gitignored — it's a local working document, not committed.

Look at how established providers structure their data. For example, the auth-rbac domain studied NextAuth, Better-auth, Auth0, Clerk, WorkOS, Supabase Auth, and Lucia before writing a single line of schema.

### 2. Write pseudo code in the domain README

The domain's `README.md` contains format-agnostic pseudo code for every table. **This is the single source of truth** — all format implementations are derived from it, not from each other.

The pseudo code uses these conventions:

```
table example {
  id            uuid primary_key default auto_generate
  name          string not_null              -- Required field
  description   string nullable             -- Optional field
  status        enum(active, inactive) not_null  -- Required enum
  category      enum(a, b, c) nullable      -- Optional enum
  score         integer default 0           -- Required, has default
  metadata      json nullable default {}    -- Optional, has default
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}
```

**Nullability rules:**
- `not_null` or no `nullable` keyword = required
- `nullable` = optional
- `default X` without `nullable` = required (has a default, but not optional)
- Enums follow the same rule: no `nullable` = required

**Other conventions:**
- `references table(field) on_delete cascade|set_null|restrict` for foreign keys
- `indexes { }` block after the table for indexes
- `unique(field)` / `index(field)` / `composite_unique(field1, field2)` in the indexes block
- Comments after `--` explain design decisions

### 3. Implement across all formats

Create **one file per table per format** (not monolithic schema files). This enables cherry-picking individual tables and supports a future CLI tool.

Each format directory contains files named after the table:
```
schemas/{domain}/
├── convex/users.ts
├── convex/sessions.ts
├── sql/users.sql
├── sql/sessions.sql
├── prisma/users.prisma
├── ...
```

Implement from the pseudo code, not from another format's implementation. Each format should be idiomatic — see [Format Conventions](#format-conventions) below, or the detailed implementation guides in `schemas/_template/{format}/README.md`.

> **For AI agents**: Use one subagent per table file (tables × formats = total agents). Do NOT have one agent write the same table across all formats or all tables in one format — this causes context-switching errors. See [AGENTS.md](./AGENTS.md) for the full workflow.

### 4. Audit

After implementation, cross-check every format file against the pseudo code. Run one audit pass per format (7 total), checking:

- **Field parity** — Every pseudo code field is present, no extra fields
- **Nullability** — `nullable` → optional; no `nullable` → required
- **Indexes** — All indexes present with correct fields; no redundant indexes on leading columns of composite unique/indexes
- **Foreign keys** — Correct references and cascade behavior (`cascade`, `set_null`, `restrict`)
- **Enums** — All values match pseudo code exactly
- **Defaults** — Default values match
- **Timestamps** — Only present when pseudo code includes them
- **Naming** — Follows format's naming convention
- **Format idioms** — Uses format-specific patterns correctly

### 5. Fix

After auditing, fix all identified issues. Run one fix pass per format (7 total) with the compiled audit results.

### 6. Final review

Manual deep review for issues that automated auditing misses:
- Cross-format consistency (did all formats apply the same fix?)
- Subtle convention violations (e.g., `@@map` on Prisma enums, unsigned integers in SpacetimeDB)
- Edge cases in format-specific idioms

## Format Conventions

Each format has specific patterns. Follow these exactly for consistency across the project.

### Convex (TypeScript)

- **Auto fields**: Convex provides `_id` and `_creationTime` automatically. **Omit `id` and `createdAt`** from the schema definition.
- **References**: Use `v.id("table_name")` for foreign keys (not `v.string()`).
- **Timestamps**: Use `v.number()` for timestamps (Unix epoch). Convex does not have a Timestamp type.
- **Nullable**: Use `v.optional(...)` for nullable fields.
- **`updatedAt`**: Only include if the pseudo code has `updated_at`.
- **Indexes**: Chain `.index("by_field", ["field"])` on the table definition.
- **Enums**: Use `v.union(v.literal("a"), v.literal("b"))`.
- **File pattern**: `defineTable({...}).index(...)`.

```typescript
// Example: convex/sessions.ts
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const sessions = defineTable({
  userId: v.id("users"),
  tokenHash: v.string(),
  expiresAt: v.number(),
  // no createdAt — Convex provides _creationTime
}).index("by_user_id", ["userId"]);
```

### SQL (PostgreSQL)

- **Dialect**: PostgreSQL. Use `TIMESTAMPTZ`, `JSONB`, `TEXT[]`, `gen_random_uuid()`.
- **Enums**: `CREATE TYPE ... AS ENUM (...)` before the table that uses them.
- **UUIDs**: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Naming**: `snake_case` for everything.
- **Indexes**: Separate `CREATE INDEX` statements after the table.
- **Comments**: Include notes for Supabase/SQLite differences where relevant.

### Prisma (Prisma DSL)

- **Field names**: `camelCase` with `@map("snake_case")` for the database column.
- **Model mapping**: `@@map("table_name")` at the bottom of each model.
- **Relations**: Explicit `@relation(fields: [...], references: [...], onDelete: ...)`.
- **IDs**: `String @id @default(uuid())` for most tables. `BigInt @id @default(autoincrement())` only for `refresh_tokens`.
- **Enums**: Separate `enum` blocks with PascalCase names.
- **DateTime**: `DateTime` type with `@default(now())`.
- **Nullable**: `Type?` syntax.

```prisma
model Session {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  tokenHash String   @unique @map("token_hash")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

### MongoDB / Mongoose (JavaScript)

- **Module system**: CommonJS (`require` / `module.exports`).
- **Foreign keys**: `{ type: mongoose.Schema.Types.ObjectId, ref: "ModelName" }`.
- **Timestamps**: Use the `timestamps` option: `{ createdAt: "created_at", updatedAt: "updated_at" }`. Set `updatedAt: false` when the pseudo code has no `updated_at`.
- **Nullable uniques**: Add `sparse: true` on optional unique fields to allow multiple nulls.
- **Required**: `required: true` on all non-nullable fields (except `_id` and timestamp fields managed by Mongoose).
- **Naming**: `snake_case` for field names (matches the database).
- **Indexes**: `schema.index({ field: 1 })` after schema definition.

### Drizzle (TypeScript)

- **Property names**: `camelCase` in JavaScript, `snake_case` strings for column names.
- **Imports**: `pgTable`, `uuid`, `text`, etc. from `"drizzle-orm/pg-core"`. The `sql` helper from `"drizzle-orm"`.
- **References**: `.references(() => otherTable.id, { onDelete: "cascade" })` — use real imports, not `import type`.
- **Timestamps**: `timestamp("column_name", { withTimezone: true })`.
- **Arrays**: `text("column_name").array()` with `.default(sql\`'{}'\`)` for empty array defaults.
- **Indexes**: Defined in the table's callback: `(table) => [index("idx_name").on(table.field)]`.

```typescript
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").unique().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.userId),
  ]
);
```

### SpacetimeDB (Rust)

- **UUIDs**: Use `String` (SpacetimeDB has no native UUID type). Comment `// UUID` next to PK fields.
- **Timestamps**: `spacetimedb::Timestamp`.
- **Primary key**: `#[primary_key]` on `pub id: String` for all tables. The **only** exception is `refresh_tokens`, which uses `pub id: u64` with `#[auto_inc]`.
- **Indexes**: Inline `#[index(btree)]` on the field. Do **not** create separate index helper tables.
- **Unique**: `#[unique]` on the field.
- **Nullable**: `Option<T>`.
- **Enums**: Separate `#[derive(SpacetimeType, Clone)]` enum with `pub` variants and `// type: String` comment.
- **Foreign keys**: Comment `// FK → table.id (cascade delete)` since SpacetimeDB doesn't enforce FKs.
- **Struct naming**: `PascalCase` singular (e.g., `Session`, `User`).

```rust
use spacetimedb::Timestamp;

#[spacetimedb::table(name = sessions, public)]
pub struct Session {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    #[unique]
    pub token_hash: String,

    pub expires_at: Timestamp,
    pub created_at: Timestamp,
}
```

### Firebase / Firestore (JavaScript)

- **Module system**: ES modules (`import` / `export`).
- **Field names**: `camelCase` (Firestore convention).
- **Timestamps**: `import { Timestamp } from "firebase/firestore"`. Use `Timestamp.now()` in factories.
- **File pattern**: Each file exports three things:
  1. **`@typedef {Object} XxxDocument`** — JSDoc type definition for the document.
  2. **`createXxx(fields)`** — Factory function that returns a plain object for `setDoc`/`addDoc`. Sets `createdAt`/`updatedAt` to `Timestamp.now()`.
  3. **`xxxConverter`** — Firestore data converter with `toFirestore`/`fromFirestore` methods.
- **Nullable fields**: Use `?? null` in both the factory and converter.
- **Enums**: `export const ENUM_NAME = /** @type {const} */ ({...})`.
- **No `id` in factory output**: The document ID is assigned by Firestore. The converter's `fromFirestore` reads `snapshot.id`.

```javascript
import { Timestamp } from "firebase/firestore";

/** @typedef {Object} SessionDocument ... */

export function createSession(fields) {
  return {
    userId:    fields.userId,
    tokenHash: fields.tokenHash,
    expiresAt: fields.expiresAt,
    createdAt: Timestamp.now(),
  };
}

export const sessionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return { id: snapshot.id, ...data };
  },
};
```

## Adding a New Format

If you want to add a new format to the project:

1. **Document the format's conventions** — Add a section to this file under [Format Conventions](#format-conventions) with the same level of detail as the existing formats. Cover: module system, naming conventions, ID/PK patterns, timestamps, references/FKs, nullable handling, indexes, and a minimal example.

2. **Add a template implementation guide** — Create `schemas/_template/{format}/README.md` following the same structure as the existing format guides (quick reference table, key rules, file template, type mappings, indexes, gotchas).

3. **Update [AGENTS.md](./AGENTS.md)** — Add the format to the Common Pitfalls section, File Naming table, and Dependencies Between Domains section.

4. **Implement for all completed domains** — A new format must be added to every domain that has a ✅ status. Partial coverage is not acceptable. Implement from each domain's README pseudo code.

5. **Update every domain README** — Add a row to the Formats table in each completed domain's README.

6. **Update the root README** — Add the format to the Formats table at the top.

7. **One file per table** — Follow the same pattern: one file per table, named after the table.

## Adding a New Domain

1. **Copy the template**: `cp -r schemas/_template schemas/{domain-name}/`
2. **Research first** — Fill out `RESEARCH.md` (gitignored) studying real-world products and services in the domain. Study at least 5-10 real implementations.
3. **Write the README** — Follow the template structure. Must include:
   - Overview
   - Dependencies (which other domains this one references)
   - Table of Contents with all tables
   - Pseudo code for every table (this is the source of truth)
   - Relationships section
   - Best Practices section
   - Formats table (all 🔲 Todo until implemented)
4. **Implement all formats** — Follow the process: pseudo code → implement → audit → fix → final review. See each format's `_template/{format}/README.md` for detailed implementation guides.
5. **Update the root README** — Add the domain to the appropriate category table with the correct table count and status

See [AGENTS.md](./AGENTS.md) for the proven AI-assisted workflow (1 agent per file for implementation, 1 agent per format for auditing).

## Comments in Schema Files

- **Keep**: Security-relevant notes, design-context comments (e.g., "Hashed — never store plaintext"), and brief field descriptions that add value beyond the field name.
- **Remove**: Provider attribution (e.g., "From Supabase pattern"), implementation guidance (e.g., "Use bcrypt here"), and verbose explanations already in the README.
- **First line**: Always a brief comment describing the table's purpose.
- **Second/third line**: `// See README.md for full design rationale.` (link back to the source of truth).

## Pull Requests

- One domain per PR (all 7 formats together), or one format across one domain
- Include a description of what you added or changed
- Ensure your schema compiles/validates where applicable (Prisma, Drizzle, Convex, SpacetimeDB can be validated)
- The pseudo code in the domain README is the **source of truth** — if your format implementation differs, explain why in the PR description

## Code of Conduct

Be kind, be helpful, be constructive. We're all here to learn and share knowledge.

## Common Pitfalls

Lessons learned from implementing completed domains:

- **Prisma enum `@@map`** — Don't add `@@map` to Prisma enum blocks. Only models get `@@map`.
- **Redundant indexes** — Don't index a single column that's already the leading column of a composite unique or composite index. The composite covers single-column lookups.
- **Prisma reverse relations** — Every `@relation` on the "many" side needs a corresponding array field on the "one" side (e.g., `files File[]`).
- **Drizzle array defaults** — Use `.default(sql\`'{}'\`)`, not `.default({})`. The latter generates invalid SQL.
- **SpacetimeDB integer types** — Use `i32`/`i64` (signed), not `u32`/`u64` (unsigned), for standard database columns.
- **Prisma `@default(now())`** — Add to both `createdAt` and `updatedAt` fields. Prisma's `@updatedAt` is a client annotation, not a schema default.
- **Drizzle bigint mode** — Use `{ mode: "number" }` for bigint fields unless the value exceeds `Number.MAX_SAFE_INTEGER`.

## Questions?

Open an issue if you have questions about contributing or want to discuss a schema design decision.
