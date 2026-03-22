# SpacetimeDB Format — Implementation Guide

## Quick Reference

| Aspect | Convention |
| ------ | ---------- |
| Language | Rust |
| File extension | `.rs` |
| Struct naming | `PascalCase` singular |
| Field naming | `snake_case` |
| Table naming | `snake_case` (in `#[spacetimedb::table]` attribute) |
| ID type | `String` with `// UUID` comment |
| Timestamps | `spacetimedb::Timestamp` |

## Key Rules

1. **UUIDs are `String`** — SpacetimeDB has no native UUID type. Add `// UUID` comment.
2. **Primary keys** — `#[primary_key] pub id: String` on all tables. Only exception: `refresh_tokens` uses `u64` with `#[auto_inc]`.
3. **Signed integers** — Use `i32` for integers, `i64` for bigints. Do NOT use `u32`/`u64` for standard DB columns.
4. **Nullable** — `Option<T>`.
5. **Foreign keys** — Comment only: `// FK → table.id (cascade delete)`. SpacetimeDB doesn't enforce FKs.
6. **Indexes** — `#[index(btree)]` inline on the field. Do NOT create separate index helper tables.
7. **Unique** — `#[unique]` inline on the field.

## File Template

```rust
// {table_name}: Brief description of the table.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TableStatus {
    Active,    // type: String
    Inactive,
}

#[spacetimedb::table(name = table_name, public)]
pub struct TableName {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub name: String,

    pub description: Option<String>,

    pub status: TableStatus,

    pub metadata: Option<String>, // JSON stored as string

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
```

## Type Mapping

| Pseudo Code | Rust/SpacetimeDB Type |
| ----------- | --------------------- |
| `string` | `String` |
| `integer` | `i32` |
| `bigint` | `i64` |
| `boolean` | `bool` |
| `decimal` | `f64` |
| `uuid` | `String` (with `// UUID` comment) |
| `json` | `Option<String>` (JSON as string) |
| `timestamp` | `Timestamp` (import `spacetimedb::Timestamp`) |
| `enum(...)` | Separate `#[derive(SpacetimeType, Clone)]` enum |
| `text[]` | `Vec<String>` |

## Enums

```rust
#[derive(SpacetimeType, Clone)]
pub enum FileStatus {
    Draft,     // type: String
    Active,
    Archived,
}
```

- Variants are `PascalCase`
- Add `// type: String` comment on the first variant
- Derive `SpacetimeType` and `Clone`

## Indexes and Constraints

```rust
// Indexed field
#[index(btree)]
pub user_id: String,

// Unique field
#[unique]
pub email: String,

// Primary key
#[primary_key]
pub id: String,

// Auto-increment (ONLY for refresh_tokens)
#[primary_key]
#[auto_inc]
pub id: u64,
```

**Note:** SpacetimeDB doesn't support composite indexes or composite unique constraints in the schema. Document these as comments:

```rust
// Composite unique: (org_id, user_id) — enforce in reducer logic
```

## Gotchas

- **No `u32`/`u64` for standard columns** — Use `i32`/`i64`. Unsigned types are only for auto-increment PKs.
- **No native UUID** — Use `String` and comment `// UUID`.
- **No FK enforcement** — Foreign keys are comments only. Cascade deletes must be handled in reducer logic.
- **No composite indexes/uniques in schema** — Document as comments, enforce in reducers.
- **JSON fields** — Store as `Option<String>` (serialized JSON). SpacetimeDB doesn't have a native JSON type.
- **Timestamps** — Import `spacetimedb::Timestamp`. No default value in schema — set in reducer logic.
- **Struct naming** — `PascalCase` singular (e.g., `FileVersion`, not `FileVersions` or `file_version`).
- **Table attribute naming** — `snake_case` in the attribute: `#[spacetimedb::table(name = file_versions, public)]`.
