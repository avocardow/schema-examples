# Agent Instructions

Instructions and guidance for AI agents working on this project. Symlinked as `CLAUDE.md` for Claude Code compatibility.

## Project Overview

This is a collection of production-ready database schema examples across formats and domains. The domain README's pseudo code is the **single source of truth** — all format implementations are derived from it.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for format conventions and [README.md](./README.md) for the full domain list.

## The Proven Workflow

Every domain follows: **research → pseudo code → implement → audit → fix → update → commit**.

### Step 1: Research

Study real-world products, libraries, and services in the domain. Write findings to `RESEARCH.md` (gitignored). Look at how established providers structure their data — study at least 5-10 real implementations before writing pseudo code. Examine overlaps, differences, best practices, and industry standards – look for potential issues and areas to improve.

### Step 2: Write Pseudo Code

Write format-agnostic pseudo code in the domain's `README.md`. This becomes the single source of truth for all format implementations. Follow the pseudo code conventions in [CONTRIBUTING.md](./CONTRIBUTING.md). Incorporate the best practices, industry standards, and patterns identified during research — the pseudo code should reflect the best of what you found, not just the most common approach.

### Step 3: Implement — One Agent per File

**Critical: Use one subagent per table file, not per format or per table across formats.**

For a domain with N tables and F formats, that's **N × F subagents** — each writing exactly one file. This is not optional. Agents that context-switch between formats or between tables produce more errors and require heavier auditing. Each agent should focus on writing the most idiomatic, production-ready code possible for its specific format — consult official documentation, best practices, and industry standards for the format.

Each implementation agent receives:

1. The pseudo code for its specific table (from the domain README)
2. The format-specific conventions (from CONTRIBUTING.md or the format's `_template` README)
3. The file path to write to
4. Any cross-table references it needs to import (other table names in the same format)
5. Documentation, best practices, recommendations from the format provider

Example agent prompt:

```
Implement the `file_versions` table for the Drizzle format.

Pseudo code:
[paste the specific table's pseudo code]

Format conventions:
[paste Drizzle conventions or reference the template README]

Write to: schemas/file-management-document-storage/drizzle/file_versions.ts

This table references: files (import from ./files), users (import from auth-rbac domain or use placeholder)

Follow the format conventions exactly. One file, one table, idiomatic Drizzle.
```

### Step 4: Audit — One Agent per Format

After all files are created, launch **one audit agent per format** (one per format). Each audit agent:

1. Reads the full pseudo code from the domain README
2. Reads all files in its assigned format
3. Checks every file against the audit checklist (below)
4. Validates against format-specific best practices, official documentation, and industry standards — not just pseudo code parity
5. Returns a structured list of issues with file paths and descriptions

### Step 5: Fix — One Agent per Format

Launch **one fix agent per format** with the compiled audit results. Each fix agent receives:

1. The specific issues found in its format
2. The pseudo code for reference
3. Instructions to fix each issue
4. Format-specific documentation, best practices, and recommendations to ensure fixes are idiomatic

### Step 6: Manual Deep Review

After automated fixes, do a final manual review focusing on:

- Cross-format consistency (did all formats get the same fix?)
- Subtle issues the audit agents might miss (e.g., enum `@@map` inconsistencies in Prisma)
- Edge cases in format-specific idioms
- Adherence to official documentation and best practices for each format
- Potential improvements or areas where the implementation could be more idiomatic

### Step 7: Update & Commit

After all files pass review:

1. Update the domain README's formats table — mark all formats as ✅
2. Update the root `README.md` — set the domain's table count and status to ✅
3. Commit all files together (domain schemas + README updates) in a single commit
4. Verify the commit includes every file — count files against expected total (tables × formats)

## Audit Checklist

When auditing a format file against pseudo code, check:

- [ ] **Field parity** — Every pseudo code field is present, no extra fields added
- [ ] **Nullability** — `nullable` in pseudo code → optional in format; no `nullable` → required
- [ ] **Indexes** — All indexes from pseudo code are present with correct fields
- [ ] **No redundant indexes** — Don't index a single field that's already the leading column of a composite unique/index
- [ ] **Foreign keys** — Correct references with correct cascade behavior (`on_delete cascade|set_null|restrict`)
- [ ] **Enums** — All enum values match pseudo code exactly
- [ ] **Defaults** — Default values match (`default 0`, `default now`, `default {}`, etc.)
- [ ] **Timestamps** — `created_at` and `updated_at` present only when pseudo code includes them
- [ ] **Naming** — Follows the format's naming convention (camelCase, snake_case, PascalCase as appropriate)
- [ ] **Format idioms** — Uses format-specific patterns correctly (see common pitfalls below)
- [ ] **Official best practices** — Follows the format provider's documented recommendations and industry standards
- [ ] **Comments** — First line describes the table's purpose; second line links back to README; security-relevant notes preserved; no provider attribution or implementation guidance

## Common Pitfalls by Format

### Convex

- Don't include `id` or `createdAt` — Convex provides `_id` and `_creationTime` automatically
- Use `v.id("table_name")` for references, not `v.string()`
- Timestamps are `v.number()` (Unix epoch), not a Date type

### SQL (PostgreSQL)

- Use `TIMESTAMPTZ` not `TIMESTAMP`
- Use `JSONB` not `JSON`
- `gen_random_uuid()` for UUID defaults
- Separate `CREATE TYPE` for enums before the table

### Prisma

- `camelCase` field names with `@map("snake_case")` for DB columns
- `@@map("table_name")` on every model
- Explicit `@relation` with `fields`, `references`, and `onDelete`
- Add reverse relations on the "one" side of one-to-many relationships
- **Don't** put `@@map` on enum blocks — Prisma enums map directly to DB enums by name
- `@default(now())` on both `createdAt` and `updatedAt` DateTime fields

### MongoDB / Mongoose

- CommonJS (`require` / `module.exports`)
- Use `timestamps` option: `{ createdAt: "created_at", updatedAt: "updated_at" }`; set `updatedAt: false` when pseudo code has no `updated_at`
- `sparse: true` on optional unique fields
- `required: true` on all non-nullable fields

### Drizzle

- `camelCase` property names, `snake_case` column name strings
- Import real table references (not `import type`)
- Empty array defaults: `.default(sql\`'{}'\`)`— not`.default({})`
- Use `{ mode: "number" }` for bigint fields unless the value truly exceeds JS safe integer range
- Timestamps: `timestamp("col", { withTimezone: true })`

### SpacetimeDB (Rust)

- `String` for UUIDs (no native UUID type), with `// UUID` comment
- `i32` for integers, `i64` for bigints — **not** unsigned types (`u32`/`u64`) for DB columns that might need negative values or where signed is conventional
- `Option<T>` for nullable fields
- `#[primary_key]` + `#[auto_inc]` only on `refresh_tokens`; all other tables use `String` PKs
- Foreign keys are comments only: `// FK → table.id (cascade delete)`
- Separate `#[derive(SpacetimeType, Clone)]` enum with `// type: String` comment

### Firebase / Firestore

- ES modules (`import` / `export`)
- `camelCase` field names
- Each file exports: JSDoc typedef, `createXxx` factory, `xxxConverter`
- Factory returns plain object with `Timestamp.now()` for created/updated timestamps
- No `id` in factory output — Firestore assigns it
- Nullable fields: `?? null` in both factory and converter
- Enums: `export const ENUM_NAME = /** @type {const} */ ({...})`

## File Naming

One file per table per format. File names match the table name:

| Format      | Extension | Example                |
| ----------- | --------- | ---------------------- |
| Convex      | `.ts`     | `file_versions.ts`     |
| SQL         | `.sql`    | `file_versions.sql`    |
| Prisma      | `.prisma` | `file_versions.prisma` |
| MongoDB     | `.js`     | `file_versions.js`     |
| Drizzle     | `.ts`     | `file_versions.ts`     |
| SpacetimeDB | `.rs`     | `file_versions.rs`     |
| Firebase    | `.js`     | `file_versions.js`     |

## Starting a New Domain

1. Copy `schemas/_template/` to `schemas/{your-domain}/`
2. Fill out `RESEARCH.md` with real-world research — study at least 5-10 real implementations, examine overlaps, differences, best practices, and industry standards
3. Write pseudo code in `README.md` (the source of truth) — incorporate the best patterns found during research
4. Spin up 1 agent per table per format for implementation (tables × formats = total agents) — each agent receives pseudo code, format conventions, provider documentation, and best practices
5. Spin up one audit agent per format to cross-check against pseudo code and format-specific best practices
6. Fix issues with one fix agent per format — provide format documentation alongside audit results
7. Manual deep review for subtle cross-format inconsistencies, adherence to official docs, and potential improvements
8. Update domain README formats table and root `README.md` with table count and ✅ status
9. Commit and verify file count matches expected total

## Dependencies Between Domains

Most domains depend on [Auth / RBAC](./schemas/auth-rbac) for `users` table references. When implementing:

- **SQL/Prisma/Drizzle**: Reference the external table directly (FK points to `users.id`)
- **Convex**: Use `v.id("users")` — assumes the users table exists in the Convex schema
- **MongoDB**: Use `{ type: mongoose.Schema.Types.ObjectId, ref: "User" }`
- **SpacetimeDB**: Comment only: `// FK → users.id`
- **Firebase**: Store the user ID as a string field (no enforced FK)

## Quality Bar

A domain is ✅ complete when:

- All tables from pseudo code are implemented in all formats
- Every file passes the audit checklist
- No redundant indexes
- All format-specific idioms are followed
- Official best practices and provider recommendations are respected
- Domain README formats table shows all ✅
- Root README shows correct table count and ✅
- File count verified: tables × formats = total files committed
