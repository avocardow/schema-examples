// moderation_queue_items: Central moderation queue for content review.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const moderationContentTypeEnum = pgEnum("moderation_content_type", [
  "post",
  "comment",
  "message",
  "user",
  "media",
]);

export const moderationSourceEnum = pgEnum("moderation_source", [
  "user_report",
  "auto_detection",
  "manual",
]);

export const moderationStatusEnum = pgEnum("moderation_status", [
  "pending",
  "in_review",
  "resolved",
  "escalated",
]);

export const moderationPriorityEnum = pgEnum("moderation_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const moderationResolutionEnum = pgEnum("moderation_resolution", [
  "approved",
  "removed",
  "escalated",
]);

export const moderationQueueItems = pgTable(
  "moderation_queue_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    contentType: moderationContentTypeEnum("content_type").notNull(), // What type of content is being reviewed.
    contentId: text("content_id").notNull(), // ID of the flagged content. String, not UUID — supports external ID formats.

    source: moderationSourceEnum("source").notNull(), // How this item entered the queue.

    status: moderationStatusEnum("status").notNull().default("pending"),
    // pending = awaiting moderator pickup.
    // in_review = assigned to a moderator, under review.
    // resolved = decision made (see resolution field).
    // escalated = sent to senior moderator/admin.

    priority: moderationPriorityEnum("priority").notNull().default("medium"),
    // Queue ordering. Critical = illegal content, imminent harm.

    assignedModeratorId: uuid("assigned_moderator_id").references(
      () => users.id,
      { onDelete: "set null" }
    ), // Moderator currently reviewing this item.

    contentSnapshot: jsonb("content_snapshot"), // Frozen copy of the content at time of flagging.

    reportCount: integer("report_count").notNull().default(0), // Denormalized from reports table for queue sorting.

    resolution: moderationResolutionEnum("resolution"),
    // Final outcome. Null = not yet resolved.
    // approved = content is fine, no action needed.
    // removed = content violates policy.
    // escalated = sent to higher authority.

    resolvedAt: timestamp("resolved_at", { withTimezone: true }), // When the item was resolved. Null = still open.

    resolvedBy: uuid("resolved_by").references(() => users.id, {
      onDelete: "set null",
    }), // Moderator who resolved this item.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_moderation_queue_items_status_priority_created").on(
      table.status,
      table.priority,
      table.createdAt
    ), // Primary queue query: pending items by priority, oldest first.
    index("idx_moderation_queue_items_content").on(
      table.contentType,
      table.contentId
    ), // All queue items for this specific content.
    index("idx_moderation_queue_items_assigned_moderator_id").on(
      table.assignedModeratorId
    ), // My assigned items.
    index("idx_moderation_queue_items_source").on(table.source), // Filter by source.
    index("idx_moderation_queue_items_status").on(table.status), // All pending items.
    index("idx_moderation_queue_items_resolved_at").on(table.resolvedAt), // Time-range queries and metrics.
  ]
);
