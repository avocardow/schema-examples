// storage_quotas: Per-entity storage limits and usage tracking for users, organizations, or buckets.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  bigint,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const storageQuotaEntityTypeEnum = pgEnum("storage_quota_entity_type", [
  "user",
  "organization",
  "bucket",
]);

export const storageQuotas = pgTable(
  "storage_quotas",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    entityType: storageQuotaEntityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(), // Polymorphic — no .references() since target varies.

    quotaBytes: bigint("quota_bytes", { mode: "number" }).notNull(), // Storage limit in bytes. Enforced at upload time.
    usedBytes: bigint("used_bytes", { mode: "number" }).notNull().default(0), // Cached: total bytes consumed. Updated on upload/delete.
    fileCount: integer("file_count").notNull().default(0), // Cached: total file count. Updated on upload/delete.
    lastComputedAt: timestamp("last_computed_at", { withTimezone: true }), // When usage was last recomputed. Null = never recomputed.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_storage_quotas_entity").on(
      table.entityType,
      table.entityId
    ),
    index("idx_storage_quotas_entity_type").on(table.entityType),
  ]
);
