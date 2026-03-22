# Agent Instructions

Symlinked as `CLAUDE.md` for Claude Code compatibility.

## Project Overview

Production-ready database schema examples across formats and domains. Each domain's README contains format-agnostic pseudo code — the **single source of truth** — from which all format implementations are derived.

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Format conventions, pseudo code syntax, enum mapping
- [README.md](./README.md) — Domain list and project structure
- `schemas/_template/{format}/README.md` — Format-specific implementation guides and gotchas

## Before You Start

**Study a completed domain first.** Read the domain README (pseudo code), then read 2-3 schema files per format to internalize the patterns:

- [Auth / RBAC](./schemas/auth-rbac) — 26 tables, the most comprehensive example
- [File Management / Document Storage](./schemas/file-management-document-storage) — 20 tables, good example of cross-table references and circular FKs
- [Notifications System](./schemas/notifications-system) — 20 tables

Pay attention to: how pseudo code maps to each format, comment conventions, Prisma reverse relations (the `File` model has 19+ reverse relation fields), circular FK handling (SQL uses `ALTER TABLE`, Drizzle uses a comment instead of `.references()`), and enum declarations per format.

## The Proven Workflow

Every domain follows: **research → pseudo code → implement → audit → fix → review → update → commit**.

### Step 1: Research

Write findings to `RESEARCH.md` (gitignored — use `schemas/_template/RESEARCH.md` as your starting structure). Use web search to find official documentation, open-source implementations, and API references. Study at least 5-10 real implementations — examine overlaps, differences, best practices, and industry standards. For each implementation, document what they got right and what could be improved. Also identify relevant standards/specifications (RFCs, industry formats) that inform the schema design. End with a clear consensus recommendation on which patterns to adopt and a decision matrix for every significant design choice.

### Step 2: Write Pseudo Code

Write format-agnostic pseudo code in the domain's `README.md`. Follow the pseudo code conventions and structure in [CONTRIBUTING.md](./CONTRIBUTING.md). Model the README after a completed domain (e.g., [file-management-document-storage](./schemas/file-management-document-storage/README.md)): overview, dependencies, table list, pseudo code with design notes, relationships diagram, best practices, and formats table.

### Step 3: Implement — One Agent per File

**Critical: One subagent = one file. Each agent writes exactly ONE schema file.**

A domain with 20 tables × 7 formats = **140 subagents** for implementation. Not 7 (one per format). Not 20 (one per table). **140.** Each agent receives the pseudo code for one table and the conventions for one format, and writes one file. This is the single most important rule — violating it (e.g., giving one agent all 20 tables for a format) produces systematic errors across every file that agent touches.

#### How to Orchestrate

1. **Parse pseudo code.** Extract each table's block from the domain README (between `### N. table_name` headings).
2. **Build the table list.** For each table, note: which tables it references (for imports) and which reference it (for Prisma reverse relations).
3. **Batch by format, one file per agent.** Pick a format, then launch one agent per table in that format (e.g., 20 agents for SQL, then 20 for Prisma, etc.). Each agent writes exactly one file. Batch in groups of ~10 if needed for concurrency limits, but never combine multiple tables into one agent.
4. **Provide complete context.** Each agent receives:
   - Pseudo code for **its single table** (verbatim from README)
   - Format conventions (from `schemas/_template/{format}/README.md`)
   - Comment conventions (see below)
   - File path to write to
   - Cross-table references (imports/FKs) and inbound references (Prisma reverse relations)
   - A reference example from a completed domain

**Wrong:** "I've launched 7 agents — one per format — to write all 140 files."
**Right:** "I'm launching 20 agents for the SQL format — one per table. Then 20 for Prisma..." (×7 formats = 140 total agents.)

#### Example Implementation Prompt

```
Implement the `file_versions` table for the Drizzle format.
Write to: schemas/{domain}/drizzle/file_versions.ts

Pseudo code:
[paste table's pseudo code from domain README]

Format conventions:
[paste schemas/_template/drizzle/README.md]

Comment conventions:
- Line 1: "// {table_name}: Brief purpose." Line 2: "// See README.md for full design rationale."
- Keep security notes; remove provider attribution and implementation guidance.

References: imports files (./files), users (./users). No inbound references.

Reference example:
[paste a similar file from a completed domain]
```

### Step 4: Audit — One Agent per Format (7 agents)

Launch **one audit agent per format** (7 total for 7 formats). Unlike implementation, auditing benefits from seeing all files together to catch cross-table inconsistencies. Each reads the full pseudo code + every file in its format directory, checks against the [Audit Checklist](#audit-checklist), and returns structured issues.

#### Example Audit Prompt

```
Audit all Prisma files in schemas/{domain}/prisma/ against this pseudo code:
[paste ENTIRE pseudo code section — all tables]

Check every file for: field parity, nullability, indexes (no redundant), FKs + cascade,
reverse relations, enums (no @@map on enum blocks), defaults, timestamps (@default(now())
on both), naming (@map/@@ map), and comment conventions.

Format conventions: [paste schemas/_template/prisma/README.md]
Reference: [paste 1-2 known-good files from a completed domain]

Return: File, Line, Issue, Fix — for every issue. Confirm clean files explicitly.
```

### Step 5: Fix — One Agent per Format (7 agents)

Launch **one fix agent per format** (7 total) with: the audit issues, pseudo code, and format conventions from `_template/{format}/README.md`.

### Step 6: Manual Deep Review

Focus on what automated auditing misses: cross-format consistency, subtle convention violations (e.g., `@@map` on Prisma enums, `u32` vs `i32` in SpacetimeDB), edge cases, and adherence to official docs.

### Step 7: Update & Commit

1. Domain README formats table: `🔲 Todo` → `✅ Done` for each format
2. Root `README.md`: set table count, change `🔲` → `✅`, update domain counter
3. Commit all files in a single commit
4. Verify file count = tables × formats. Ensure no `_template/` guide READMEs were included.

## Comment Conventions

```
// {table_name}: Brief description of the table's purpose.
// See README.md for full design rationale.
```

**Keep**: Security notes, design-context comments, field descriptions that add value. **Remove**: Provider attribution, implementation guidance, verbose explanations covered in README. SQL uses `--`; all other formats use `//`.

## Handling Edge Cases

### Circular Foreign Keys

When tables reference each other (e.g., `files ↔ file_versions`):

- **SQL**: Define both tables, then `ALTER TABLE ... ADD CONSTRAINT ... FOREIGN KEY ... REFERENCES ...`
- **Drizzle**: Cannot use `.references()` due to circular imports — add a comment: `// NOTE: Circular FK — cannot use .references() here`
- **Prisma**: Handles circular refs natively — declare both relations normally
- **Convex/MongoDB/SpacetimeDB/Firebase**: No circular issue (runtime resolution, lazy refs, comment-only FKs, or string IDs)

### Forward Foreign Keys (SQL)

When table A references table B, but B's `.sql` file is loaded *after* A alphabetically (e.g., `events.sql` references `sessions` from `sessions.sql`), the inline `REFERENCES` will fail because the target table doesn't exist yet. Use `ALTER TABLE` instead:

```sql
-- In events.sql: don't use inline REFERENCES for session_id
session_id UUID,

-- Forward FK: sessions is defined in sessions.sql (loaded after events.sql).
ALTER TABLE events ADD CONSTRAINT fk_events_session_id
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;
```

This is different from circular FKs (A ↔ B) — forward FKs are one-directional but still need deferred definition.

### Prisma Reverse Relations

Every `@relation` on the "many" side needs a reverse field on the "one" side. Central tables (like `files`) may need 10-20+ reverse relations. **Pre-compute these** when orchestrating: scan all tables for FK references, build the reverse map, and include the full list in each Prisma agent's prompt.

### Shared Enums Across Files

When multiple tables use the same enum (e.g., a `status` enum shared by `translation_values` and `content_translations`):

- **SpacetimeDB/Rust**: Define the enum in the first table file that uses it. In subsequent files, add a comment: `// Uses EnumName from first_table.rs — do not redefine here.` Duplicate enum definitions cause Rust compilation errors.
- **Drizzle/TypeScript**: Define the `pgEnum` in the first table file. Import it in subsequent files: `import { statusEnum } from "./first_table";`
- **SQL**: `CREATE TYPE` is global — define once in the first file, reference in subsequent files with a comment.
- **Prisma/Convex/MongoDB/Firebase**: Shared enums are handled naturally (Prisma enums are global, others use inline strings).

### Cross-Format Enum Naming

SQL and Drizzle both target PostgreSQL — their enum type names must match. If SQL defines `CREATE TYPE rollup_granularity AS ENUM (...)`, Drizzle must use `pgEnum("rollup_granularity", [...])`, not a different name like `metric_granularity`. The pseudo code's enum name is the source of truth for both formats.

### Index Precedence Rule

Format guide conventions take precedence over pseudo code for index optimization. If the pseudo code specifies an index that is redundant per the format guide's "no leading-column redundancy" rule, **omit the redundant index**. Example: if pseudo code specifies both `index(a, b, c)` and `index(a, b)`, omit the latter — the composite index covers leading-column queries.

### Cross-Domain Dependencies

Most domains depend on [Auth / RBAC](./schemas/auth-rbac) for `users`. Each format handles external references the same way it handles internal ones — see `schemas/_template/{format}/README.md` for the pattern. If the dependency domain isn't complete yet, use the same patterns — the FK resolves once both are implemented.

## Audit Checklist

- [ ] **Strict spec adherence** — Implement exactly what the pseudo code specifies. No extra validations, constraints, or enum restrictions beyond what's defined. If the pseudo code says `string nullable`, don't add an `enum` constraint even if the values are known.
- [ ] **Field parity** — Every pseudo code field present, no extra fields
- [ ] **Nullability** — `nullable` → optional; no `nullable` → required
- [ ] **Indexes** — All pseudo code indexes present, no redundant indexes on leading columns of composite unique/index, **no extra indexes not in pseudo code** (agents sometimes add plausible indexes like `index(created_by)` that aren't specified — remove them)
- [ ] **Foreign keys** — Correct references and cascade behavior
- [ ] **Enums** — Values match pseudo code exactly
- [ ] **Defaults** — Match pseudo code (`default 0`, `default now`, `default {}`)
- [ ] **Timestamps** — Present only when pseudo code includes them
- [ ] **Naming** — Follows format convention (camelCase, snake_case, PascalCase)
- [ ] **Format idioms** — See `schemas/_template/{format}/README.md` for gotchas
- [ ] **Comments** — Follows [Comment Conventions](#comment-conventions)
- [ ] **Edge cases** — Circular FKs, reverse relations, cross-domain refs (see above)

## File Naming

One file per table per format, named in `snake_case`: `file_versions.ts` / `.sql` / `.prisma` / `.js` / `.rs`

## Quality Bar

A domain is ✅ complete when all tables are implemented in all formats, every file passes the audit checklist, edge cases are handled, comment conventions are followed, both READMEs are updated, and file count = tables × formats.
