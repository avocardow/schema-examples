# MongoDB / Mongoose Format — Implementation Guide

## Quick Reference

| Aspect | Convention |
| ------ | ---------- |
| Language | JavaScript |
| File extension | `.js` |
| Module system | CommonJS (`require` / `module.exports`) |
| Field naming | `snake_case` |
| Collection naming | `snake_case` (plural, via model name) |
| ID type | Auto-generated `_id` (ObjectId) |
| Timestamps | Mongoose `timestamps` option |

## Key Rules

1. **CommonJS** — Use `require` and `module.exports`, not ES module `import`/`export`.
2. **Timestamps** — Use the `timestamps` option: `{ createdAt: "created_at", updatedAt: "updated_at" }`. Set `updatedAt: false` when pseudo code has no `updated_at`.
3. **Required** — `required: true` on all non-nullable fields (except `_id` and managed timestamps).
4. **References** — `{ type: mongoose.Schema.Types.ObjectId, ref: "ModelName" }`.
5. **Sparse uniques** — Add `sparse: true` on optional unique fields to allow multiple nulls.
6. **Field naming** — `snake_case` for all field names (matches DB storage).

## File Template

```javascript
// {table_name}: Brief description of the table.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tableNameSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
tableNameSchema.index({ user_id: 1 });
tableNameSchema.index({ status: 1 });

module.exports = mongoose.model("TableName", tableNameSchema);
```

## Field Type Mapping

| Pseudo Code | Mongoose Type |
| ----------- | ------------- |
| `string` | `String` |
| `integer` | `Number` |
| `bigint` | `Number` |
| `boolean` | `Boolean` |
| `decimal` | `Number` |
| `uuid` (FK) | `mongoose.Schema.Types.ObjectId` with `ref` |
| `json` | `mongoose.Schema.Types.Mixed` |
| `timestamp` | Managed by `timestamps` option, or `Date` for non-standard |
| `enum(...)` | `String` with `enum: [...]` |
| `text[]` | `[String]` |

## Indexes

```javascript
// Single field index
schema.index({ field: 1 });

// Composite index
schema.index({ field_a: 1, field_b: 1 });

// Unique index
schema.index({ field: 1 }, { unique: true });

// Composite unique
schema.index({ org_id: 1, user_id: 1 }, { unique: true });

// Sparse unique (for optional unique fields)
schema.index({ field: 1 }, { unique: true, sparse: true });
```

## Gotchas

- **Don't index a field that has `unique: true` inline** — Mongoose creates an index automatically for unique fields.
- **`sparse: true`** is required on unique indexes where the indexed field(s) include a nullable field — this applies to both single-field uniques (e.g., `{ email: 1 }` where `email` has `default: null`) and **composite uniques** where at least one field is nullable (e.g., `{ experiment_id: 1, user_id: 1 }` where `user_id` is optional). **Do NOT add `sparse: true` when all indexed fields are `required: true`** — sparse is only needed when null values are possible.
- **`required: true`** should NOT be on timestamp fields managed by the `timestamps` option.
- **`default: null`** is how you express a nullable field without `required: true`.
- **Model names** are `PascalCase` singular — Mongoose automatically pluralizes and lowercases for the collection name.
- **Don't index the leading field of a composite unique separately** — the composite index covers it.
