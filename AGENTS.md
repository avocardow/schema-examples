# Agent Instructions

Symlinked as `CLAUDE.md` for Claude Code compatibility.

**This file contains mandatory instructions, not suggestions. Follow each step in order. Do not plan ahead — complete one step, stop, then re-read before starting the next.**

## Project Overview

Production-ready database schema examples across formats and domains. Each domain's README contains format-agnostic pseudo code — the **single source of truth** — from which all format implementations are derived.

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Format conventions, pseudo code syntax, enum mapping
- [README.md](./README.md) — Domain list and project structure
- `schemas/_template/{format}/README.md` — Format-specific implementation guides and gotchas

## Before You Start

**Study a completed domain first.** Read the domain README (pseudo code), then read 2-3 schema files per format to internalize the patterns:

- [Auth / RBAC](./schemas/auth-rbac) — 26 tables, the most comprehensive foundational example
- [E-commerce](./schemas/e-commerce) — 35 tables, the largest domain with complex order/payment/fulfillment flows
- [File Management / Document Storage](./schemas/file-management-document-storage) — good example of cross-table references and circular FKs
- [Notifications System](./schemas/notifications-system)

Pay attention to: how pseudo code maps to each format, comment conventions, Prisma reverse relations (the `File` model has 19+ reverse relation fields), circular FK handling (SQL uses `ALTER TABLE`, Drizzle uses a comment instead of `.references()`), and enum declarations per format.

**Do not let completed domains influence your table count.** The number of tables in a new domain should be determined entirely by your research — what the domain actually needs. Don't anchor on the table counts of existing domains. If your research identifies 24 tables, implement 24. If it identifies 15, implement 15.

**⚠️ Common failure mode:** Agents say "I need to refine to N" and start collapsing well-researched tables to hit a round number. This is exactly wrong. Never merge, collapse, or remove tables from your research to reach a specific count. Never add filler tables to inflate the count either. The research output is the table list — do not adjust it.

**Apply the dependency test to every table.** Before finalizing your table list, ask two questions about each table:

1. **"Would this table be owned by a different domain?"** — If another domain in this project would naturally own this concept (e.g., `users` belongs to auth-rbac, `projects` belongs to project-management, `payments` belongs to billing), then reference it as an external FK dependency — don't recreate it. Use generic names like `users(id)` as FKs and list the dependency in the README's Dependencies section.

2. **"Is this table actually useful for users building real apps?"** — Users adopt these schemas to build applications, not to rebuild the SaaS platforms we studied in research. A table that exists in Crowdin/Stripe/Datadog doesn't automatically belong in the schema. Ask: would a developer building an app that *uses* this domain actually need this table, or is it admin/platform infrastructure? Tables that only make sense if you're building the platform itself (e.g., TMS task assignment, billing plan management, analytics dashboard configuration) should be excluded.

These two filters — dependency ownership and user value — prevent scope creep and keep schemas composable.

## The Proven Workflow

Every domain follows these steps **strictly in order**. Do not skip ahead — each step's output is the input for the next. **After completing each step, stop and re-read this workflow section before proceeding to the next step.** Do not chain steps together in one continuous run.

**research → pseudo code → implement → audit → fix → review → update → commit**

### Step 1: Research

**Prerequisite:** None. This is always the first step.
**Output:** A completed `RESEARCH.md` file in the domain directory.
**Gate:** Do not design any tables, write any pseudo code, or create any schema files until `RESEARCH.md` is fully written with all sections complete.

Write findings to `RESEARCH.md` (gitignored — use `schemas/_template/RESEARCH.md` as your starting structure). Use web search to find official documentation, open-source implementations, and API references. Study at least 5-10 real implementations — examine overlaps, differences, best practices, and industry standards. For each implementation, document what they got right and what could be improved. Also identify relevant standards/specifications (RFCs, industry formats) that inform the schema design. End with a clear consensus recommendation on which patterns to adopt and a decision matrix for every significant design choice.

The table list and table count must emerge from this research — not from preconceptions or other domains' patterns.

Before finalizing the table list, apply the **dependency test** and **user value test** from [Before You Start](#before-you-start) to every table. Remove tables that belong to other domains (reference them as external FKs instead) and tables that are only useful for building the platform itself rather than apps that use the domain.

**⛔ STOP after this step.** Confirm `RESEARCH.md` is complete before moving to Step 2. The README.md must not exist yet.

### Step 2: Write Pseudo Code

**Prerequisite:** A completed `RESEARCH.md` exists in the domain directory. No `README.md` has been written yet.
**Output:** A completed `README.md` with full pseudo code for every table.
**Gate:** Do not launch any implementation agents until every table's pseudo code block is finalized in the README.

Write format-agnostic pseudo code in the domain's `README.md`. The table list, table count, and table designs must be derived from the research in `RESEARCH.md` — not from general knowledge or patterns in other domains. **Implement every table identified in the research.** Do not collapse, merge, or remove tables to reach a lower count. Do not add tables not in the research. Follow the pseudo code conventions and structure in [CONTRIBUTING.md](./CONTRIBUTING.md). Model the README after a completed domain (e.g., [file-management-document-storage](./schemas/file-management-document-storage/README.md)): overview, dependencies, table list, pseudo code with design notes, relationships diagram, best practices, and formats table.

**⛔ STOP after this step.** Confirm `README.md` pseudo code is complete for all tables before moving to Step 3. No schema files should exist yet.

### Step 3: Implement — One Agent per File

**Prerequisite:** Both `RESEARCH.md` and `README.md` exist. The README has finalized pseudo code for all tables. No format directories contain schema files yet.
**Output:** One schema file per table per format (tables × 7 files).

**Critical: One subagent = one file. Each agent writes exactly ONE schema file.**

A domain with N tables × 7 formats = **N×7 subagents** for implementation. Not 7 (one per format). Not N (one per table). **N×7.** Each agent receives the pseudo code for one table and the conventions for one format, and writes one file. This is the single most important rule — violating it (e.g., giving one agent all tables for a format) produces systematic errors across every file that agent touches.

#### How to Orchestrate

1. **Parse pseudo code.** Extract each table's block from the domain README (between `### N. table_name` headings).
2. **Build the table list.** For each table, note: which tables it references (for imports) and which reference it (for Prisma reverse relations).
3. **Batch by format, one file per agent.** Pick a format, then launch one agent per table in that format (e.g., N agents for SQL, then N for Prisma, etc.). Each agent writes exactly one file. Batch in groups of ~10 if needed for concurrency limits, but never combine multiple tables into one agent.
4. **Provide complete context.** Each agent receives:
   - Pseudo code for **its single table** (verbatim from README)
   - Format conventions (from `schemas/_template/{format}/README.md`)
   - Comment conventions (see below)
   - File path to write to
   - Cross-table references (imports/FKs) and inbound references (Prisma reverse relations)
   - A reference example from a completed domain

**Wrong:** "I've launched 7 agents — one per format — to write all N×7 files."
**Right:** "I'm launching N agents for the SQL format — one per table. Then N for Prisma..." (×7 formats = N×7 total agents.)

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

**Prerequisite:** All implementation agents have completed. Verify file count = tables × 7 before proceeding.
**Output:** Structured issue list per format.

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

**⛔ STOP after this step.** Review all audit results before proceeding to fixes.

### Step 5: Fix — One Agent per Format (7 agents)

**Prerequisite:** All audit agents have returned their issue lists.
**Output:** All issues resolved. Zero known issues remaining.

Launch **one fix agent per format** (7 total) with: the audit issues, pseudo code, and format conventions from `_template/{format}/README.md`.

**⛔ STOP after this step.** Verify all fixes are applied before deep review.

### Step 6: Manual Deep Review

**Prerequisite:** All fix agents have completed.

Focus on what automated auditing misses: cross-format consistency, subtle convention violations (e.g., `@@map` on Prisma enums, `u32` vs `i32` in SpacetimeDB), edge cases, and adherence to official docs.

**⛔ STOP after this step.** All issues must be resolved before committing.

### Step 7: Update & Commit

**Prerequisite:** Deep review is complete and all issues are resolved.

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

Most domains depend on [Auth / RBAC](./schemas/auth-rbac) for `users`. Some domains may depend on others for `projects`, `teams`, `payments`, etc. **Never recreate a table that belongs to another domain** — reference it as an external FK instead.

How to handle dependencies:
- **README Dependencies section:** List each external domain and the tables/columns referenced (see any completed domain for the format).
- **FK references:** Use the external table name in pseudo code and all formats (e.g., `references users(id)`). The FK resolves once both domains are implemented.
- **Format files:** Each format handles external references the same way it handles internal ones — see `schemas/_template/{format}/README.md` for the pattern.
- **Prisma:** External models don't need reverse relations in your domain files (the dependency domain owns those).

Common dependencies: `users` (auth-rbac), `files` (file-management), `locales` (i18n). If you're unsure whether a table is a dependency or belongs in your domain, apply the ownership test: which domain would a user expect to find this table in?

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
