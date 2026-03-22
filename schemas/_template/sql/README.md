# SQL (PostgreSQL) Format — Implementation Guide

## Quick Reference

| Aspect | Convention |
| ------ | ---------- |
| Dialect | PostgreSQL |
| File extension | `.sql` |
| Field naming | `snake_case` |
| Table naming | `snake_case` |
| ID type | `UUID DEFAULT gen_random_uuid()` |
| Timestamps | `TIMESTAMPTZ DEFAULT NOW()` |

## Key Rules

1. **PostgreSQL-specific types**: `TIMESTAMPTZ` (not `TIMESTAMP`), `JSONB` (not `JSON`), `TEXT[]` for arrays.
2. **UUIDs**: `UUID PRIMARY KEY DEFAULT gen_random_uuid()` on all tables (exception: auto-increment on `refresh_tokens`).
3. **Enums**: Define with `CREATE TYPE` before the table that uses them.
4. **Indexes**: Separate `CREATE INDEX` statements after the table definition.
5. **Naming**: Everything is `snake_case`.

## File Template

```sql
-- {table_name}: Brief description of the table.
-- See README.md for full design rationale.

CREATE TYPE table_status AS ENUM ('active', 'inactive');

CREATE TABLE table_name (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,  -- Nullable (no NOT NULL)
    status          table_status NOT NULL DEFAULT 'active',
    metadata        JSONB,
    tags            TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_table_name_user_id ON table_name(user_id);
CREATE INDEX idx_table_name_status ON table_name(status);
```

## Constraints

```sql
-- Unique
UNIQUE(email)

-- Composite unique
UNIQUE(org_id, user_id)

-- Check constraint
CHECK (size >= 0)

-- Foreign key with cascade
REFERENCES other_table(id) ON DELETE CASCADE
REFERENCES other_table(id) ON DELETE SET NULL
REFERENCES other_table(id) ON DELETE RESTRICT
```

## Index Patterns

```sql
-- Standard B-tree index
CREATE INDEX idx_table_field ON table_name(field);

-- Composite index
CREATE INDEX idx_table_a_b ON table_name(field_a, field_b);

-- Unique index (alternative to UNIQUE constraint)
CREATE UNIQUE INDEX idx_table_field ON table_name(field);

-- Partial index (PostgreSQL-specific)
CREATE INDEX idx_table_active ON table_name(status) WHERE status = 'active';
```

## Supabase / SQLite Notes

- Include comments where behavior differs: `-- Supabase: use auth.uid() for RLS`
- SQLite doesn't support `ENUM` — use `TEXT CHECK(col IN (...))` instead
- SQLite doesn't support `TIMESTAMPTZ` — use `TEXT` with ISO 8601 format
- SQLite uses `AUTOINCREMENT` not `gen_random_uuid()`

## Gotchas

- Don't create a separate index on a column that already has a `UNIQUE` constraint (PostgreSQL creates one automatically)
- Don't index the leading column of a composite index separately — the composite index covers single-column lookups on the leading column
- `NOT NULL` with `DEFAULT` means the column is required but has a fallback — the default applies on INSERT, not on NULL
- `JSONB DEFAULT '{}'` vs `JSONB` (nullable) — choose based on pseudo code
- **Forward FK references** — If table A references table B but B's `.sql` file loads *after* A alphabetically, don't use an inline `REFERENCES` (it will fail). Instead, use `ALTER TABLE` after the `CREATE TABLE`:
  ```sql
  -- Forward FK: sessions is defined in sessions.sql (loaded after events.sql).
  ALTER TABLE events ADD CONSTRAINT fk_events_session_id
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;
  ```
  This is different from *circular* FKs (A ↔ B) — forward FKs are one-directional but still need deferred definition when the target table hasn't been created yet.
