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

Implement from the pseudo code, not from another format's implementation. Each format should be idiomatic — see [Format Conventions](#format-conventions) below, or the detailed implementation guides in `schemas/_template/{format}/README.md`.

> **For AI agents**: Use one subagent per table file (tables × formats = total agents). See [AGENTS.md](./AGENTS.md) for the full orchestration workflow.

### 4. Audit

After implementation, cross-check every format file against the pseudo code. Run one audit pass per format, checking:

- **Field parity** — Every pseudo code field present, no extra fields
- **Nullability** — `nullable` → optional; no `nullable` → required
- **Indexes** — All present; no redundant indexes on leading columns of composite unique/indexes
- **Foreign keys** — Correct references and cascade behavior
- **Enums** — Values match pseudo code exactly
- **Defaults, timestamps, naming, format idioms** — All correct per format conventions

### 5. Fix

Fix all identified issues — one fix pass per format with the compiled audit results.

### 6. Final review

Manual deep review for issues that automated auditing misses:
- Cross-format consistency (did all formats apply the same fix?)
- Subtle convention violations (e.g., `@@map` on Prisma enums, unsigned integers in SpacetimeDB)
- Edge cases in format-specific idioms

## Format Conventions

Each format has specific patterns. Follow these exactly for consistency. For comprehensive guides with file templates, type mappings, and gotchas, see `schemas/_template/{format}/README.md`.

### Convex (TypeScript)

- **Auto fields**: Convex provides `_id` and `_creationTime` automatically. **Omit `id` and `createdAt`**.
- **References**: `v.id("table_name")` (not `v.string()`).
- **Timestamps**: `v.number()` (Unix epoch). No native Date type.
- **Nullable**: `v.optional(...)`.
- **Enums**: `v.union(v.literal("a"), v.literal("b"))`.
- **Indexes**: `.index("by_field", ["field"])` chained on the table definition.

### SQL (PostgreSQL)

- **Dialect**: PostgreSQL. Use `TIMESTAMPTZ`, `JSONB`, `TEXT[]`, `gen_random_uuid()`.
- **Enums**: `CREATE TYPE ... AS ENUM (...)` before the table.
- **UUIDs**: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Naming**: `snake_case` for everything.
- **Indexes**: Separate `CREATE INDEX` statements after the table.

### Prisma (Prisma DSL)

- **Field names**: `camelCase` with `@map("snake_case")`.
- **Model mapping**: `@@map("table_name")` on every model.
- **Relations**: Explicit `@relation(fields: [...], references: [...], onDelete: ...)`.
- **Reverse relations**: Required on the "one" side of one-to-many. Named relations when multiple FKs target the same model.
- **Enums**: Separate `enum` blocks, PascalCase names. **No `@@map` on enums.**
- **DateTime**: `@default(now())` on both `createdAt` and `updatedAt`.

### MongoDB / Mongoose (JavaScript)

- **Module system**: CommonJS (`require` / `module.exports`).
- **References**: `{ type: mongoose.Schema.Types.ObjectId, ref: "ModelName" }`.
- **Timestamps**: `{ createdAt: "created_at", updatedAt: "updated_at" }`. Set `updatedAt: false` when no `updated_at`.
- **Nullable uniques**: `sparse: true`.
- **Required**: `required: true` on all non-nullable fields.
- **Naming**: `snake_case`.

### Drizzle (TypeScript)

- **Naming**: `camelCase` properties, `snake_case` column name strings.
- **Imports**: Real table imports (not `import type`). `sql` helper from `"drizzle-orm"`.
- **References**: `.references(() => otherTable.id, { onDelete: "cascade" })`.
- **Timestamps**: `timestamp("col", { withTimezone: true })`.
- **Arrays**: `.default(sql\`'{}'\`)` (not `.default({})`).
- **Bigint**: `{ mode: "number" }` unless value exceeds `MAX_SAFE_INTEGER`.

### SpacetimeDB (Rust)

- **UUIDs**: `String` with `// UUID` comment. No native UUID type.
- **Integers**: `i32`/`i64` (signed). **Not** `u32`/`u64` for standard columns.
- **Primary key**: `#[primary_key] pub id: String`. Exception: `refresh_tokens` uses `u64` + `#[auto_inc]`.
- **Indexes**: `#[index(btree)]` inline. `#[unique]` for unique fields.
- **Nullable**: `Option<T>`.
- **Foreign keys**: Comment only: `// FK → table.id (cascade delete)`.
- **Enums**: `#[derive(SpacetimeType, Clone)]` with `// type: String` comment.

### Firebase / Firestore (JavaScript)

- **Module system**: ES modules (`import` / `export`).
- **Field names**: `camelCase`.
- **File exports**: JSDoc `@typedef`, `createXxx` factory, `xxxConverter`.
- **Timestamps**: `Timestamp.now()` from `firebase/firestore`.
- **Nullable**: `?? null` in both factory and converter.
- **Enums**: `export const ENUM_NAME = /** @type {const} */ ({...})`.
- **No `id`** in factory output — Firestore assigns it; converter reads `snapshot.id`.

## Enum Mapping Across Formats

When pseudo code defines `enum(active, inactive)`:

| Format      | Pattern |
| ----------- | ------- |
| Convex      | `v.union(v.literal("active"), v.literal("inactive"))` |
| SQL         | `CREATE TYPE status AS ENUM ('active', 'inactive');` |
| Prisma      | `enum Status { active inactive }` (PascalCase name, **no `@@map`**) |
| MongoDB     | `{ type: String, enum: ["active", "inactive"] }` |
| Drizzle     | `pgEnum("status", ["active", "inactive"])` |
| SpacetimeDB | `pub enum Status { Active, Inactive }` with `#[derive(SpacetimeType, Clone)]` |
| Firebase    | `export const STATUS = /** @type {const} */ ({ ACTIVE: "active", INACTIVE: "inactive" })` |

## Adding a New Format

1. **Document conventions** — Add a section under [Format Conventions](#format-conventions) above.
2. **Add template guide** — Create `schemas/_template/{format}/README.md` (quick reference, key rules, file template, type mappings, gotchas).
3. **Update [AGENTS.md](./AGENTS.md)** — Add to edge case handling and any format-specific notes.
4. **Implement for all completed domains** — Must cover every ✅ domain. No partial coverage.
5. **Update READMEs** — Add format row to every completed domain's Formats table and the root README Formats table.
6. **One file per table** — Same pattern as all other formats.

## Adding a New Domain

1. **Copy template**: `cp -r schemas/_template schemas/{domain-name}/`
2. **Delete format guide READMEs** from the copy — `find schemas/{domain-name} -path "*/*/README.md" -delete`. Keep top-level `README.md` and `RESEARCH.md`.
3. **Research** — Fill out `RESEARCH.md` studying 5-10+ real implementations.
4. **Write README** — Follow template structure: overview, dependencies, table list, pseudo code (source of truth), relationships, best practices, formats table (`🔲 Todo`).
5. **Implement** — Pseudo code → implement → audit → fix → final review. See `_template/{format}/README.md` for guides.
6. **Update root README** — Table count and ✅ status.

See [AGENTS.md](./AGENTS.md) for the AI-assisted workflow (1 agent per file, 1 audit agent per format).

## Comments in Schema Files

- **First line**: Brief comment describing the table's purpose.
- **Second line**: `// See README.md for full design rationale.`
- **Keep**: Security notes, design context, field descriptions that add value.
- **Remove**: Provider attribution, implementation guidance, verbose explanations.

## Pull Requests

- One domain per PR (all formats together), or one format across one domain
- Ensure schemas compile/validate where applicable (Prisma, Drizzle, Convex, SpacetimeDB)
- Pseudo code is the source of truth — explain any deviations in the PR description

## Code of Conduct

Be kind, be helpful, be constructive. We're all here to learn and share knowledge.

## Questions?

Open an issue if you have questions about contributing or want to discuss a schema design decision.
