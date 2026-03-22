# Convex Format — Implementation Guide

## Quick Reference

| Aspect | Convention |
| ------ | ---------- |
| Language | TypeScript |
| File extension | `.ts` |
| Module system | ES modules |
| Field naming | `camelCase` |
| Table naming | `snake_case` |
| ID type | Auto-generated `_id` |
| Timestamps | `v.number()` (Unix epoch ms) |

## Key Rules

1. **Convex provides `_id` and `_creationTime` automatically.** Never include `id` or `createdAt` in your schema definition.
2. **References** use `v.id("table_name")`, not `v.string()`.
3. **No native Date type** — use `v.number()` for all timestamps (Unix epoch milliseconds).
4. **`updatedAt`** — Only include if the pseudo code has `updated_at`. Use `v.number()`.
5. **Nullable fields** — Use `v.optional(...)`.
6. **Enums** — `v.union(v.literal("value1"), v.literal("value2"))`.

## File Template

```typescript
// {table_name}: Brief description of the table.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tableName = defineTable({
  // Foreign keys
  userId: v.id("users"),

  // Required fields
  name: v.string(),
  status: v.union(v.literal("active"), v.literal("inactive")),

  // Optional fields
  description: v.optional(v.string()),
  metadata: v.optional(v.any()),

  // Timestamps (only updatedAt — createdAt is auto via _creationTime)
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_status", ["status"]);
```

## Indexes

- Chain `.index("by_field", ["field"])` on the table definition.
- Composite indexes: `.index("by_a_and_b", ["fieldA", "fieldB"])`.
- Convex doesn't support unique constraints in the schema — enforce uniqueness in your mutation logic.
- Don't create indexes on fields that are already the leading column of another index.

## Common Patterns

### Nullable with default
```typescript
metadata: v.optional(v.any()), // Don't set default in schema — handle in mutations
```

### Array fields
```typescript
tags: v.array(v.string()),
```

### Nested objects
```typescript
settings: v.object({
  key: v.string(),
  value: v.string(),
}),
```

## Gotchas

- Convex table names in `v.id()` must match the table name exactly as defined in the schema
- No `ON DELETE CASCADE` — handle cascading deletes in your mutation logic
- No `UNIQUE` constraint in schema — validate uniqueness in mutations or use a unique index
- `v.optional()` wraps the entire type: `v.optional(v.string())`, not `v.string().optional()`
