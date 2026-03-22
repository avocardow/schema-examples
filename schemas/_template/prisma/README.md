# Prisma Format — Implementation Guide

## Quick Reference

| Aspect | Convention |
| ------ | ---------- |
| Language | Prisma DSL |
| File extension | `.prisma` |
| Field naming | `camelCase` with `@map("snake_case")` |
| Model naming | `PascalCase` with `@@map("table_name")` |
| ID type | `String @id @default(uuid())` |
| Timestamps | `DateTime @default(now())` |

## Key Rules

1. **Field names** are `camelCase` in Prisma, mapped to `snake_case` DB columns with `@map("snake_case")`.
2. **Model names** are `PascalCase`, mapped to `snake_case` table names with `@@map("table_name")`.
3. **Every relation** needs explicit `@relation(fields: [...], references: [...], onDelete: ...)`.
4. **Reverse relations** — The "one" side of a one-to-many needs a reverse relation field (e.g., `versions FileVersion[]`).
5. **Enums** are separate blocks with `PascalCase` names. **Do NOT put `@@map` on enum blocks.**
6. **DateTime defaults** — Both `createdAt` and `updatedAt` get `@default(now())`. Prisma's `@updatedAt` is a client-side concern, not schema.

## File Template

```prisma
// {table_name}: Brief description of the table.
// See README.md for full design rationale.

enum TableStatus {
  active
  inactive
}

model TableName {
  id          String      @id @default(uuid())
  userId      String      @map("user_id")
  name        String
  description String?     // Nullable
  status      TableStatus @default(active) @map("status")
  metadata    Json?
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @default(now()) @map("updated_at")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Reverse relations (one-to-many)
  children ChildModel[]

  @@index([userId])
  @@index([status])
  @@map("table_name")
}
```

## Relations

```prisma
// Many-to-one (on the "many" side)
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

// One-to-many reverse (on the "one" side)
files File[]

// Named relations (when multiple relations to the same model)
creator   User @relation("FileCreator", fields: [creatorId], references: [id])
updater   User @relation("FileUpdater", fields: [updaterId], references: [id])

// Reverse for named relations
createdFiles File[] @relation("FileCreator")
updatedFiles File[] @relation("FileUpdater")
```

## Indexes and Constraints

```prisma
// Single index
@@index([fieldName])

// Composite unique
@@unique([orgId, userId])

// Single unique (inline)
email String @unique

// Composite index
@@index([fieldA, fieldB])
```

## Enum Conventions

```prisma
// DO this:
enum FileStatus {
  draft
  active
  archived
}

// Do NOT do this (no @@map on enums):
enum FileStatus {
  draft
  active
  archived
  @@map("file_status")  // WRONG — don't do this
}
```

## Gotchas

- **Reverse relations are required.** If `FileVersion` has a `file File @relation(...)`, then `File` must have `versions FileVersion[]`.
- **Named relations** are needed when a model has multiple FK references to the same target model.
- **`@default(now())`** goes on both `createdAt` and `updatedAt`. Do NOT use `@updatedAt` — that's a Prisma client behavior annotation, not a schema default.
- **`@@map` on enums** — Don't. Prisma maps enum names to PG enum types by their Prisma name.
- **`@unique` creates an implicit index** — don't add a separate `@@index` for the same field.
- **Composite `@@unique` covers leading-column queries** — don't add a separate `@@index` for the first field of a composite unique.
