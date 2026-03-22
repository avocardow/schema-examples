// reports: User-submitted content reports.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { moderationQueueItems } from "./moderation_queue_items";
import { moderationPolicies } from "./moderation_policies";

export const reportContentTypeEnum = pgEnum("report_content_type", [
  "post",
  "comment",
  "message",
  "user",
  "media",
]);

export const reportCategoryEnum = pgEnum("report_category", [
  "spam",
  "harassment",
  "hate_speech",
  "violence",
  "sexual_content",
  "illegal",
  "misinformation",
  "self_harm",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "reviewed",
  "dismissed",
]);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Who submitted this report. Cascade: if reporter is deleted, their reports are removed.
    contentType: reportContentTypeEnum("content_type").notNull(), // What type of content is being reported.
    contentId: text("content_id").notNull(), // ID of the reported content. String for external ID support.
    queueItemId: uuid("queue_item_id").references(
      () => moderationQueueItems.id,
      { onDelete: "set null" }
    ), // The queue item this report is linked to. Set null: if queue item is deleted, report preserves history.
    category: reportCategoryEnum("category").notNull(), // Reporter-selected reason category.
    reasonText: text("reason_text"), // Free-text explanation from the reporter.
    policyId: uuid("policy_id").references(() => moderationPolicies.id, {
      onDelete: "set null",
    }), // Which specific policy the reporter believes was violated. Set null: if policy is deleted, report preserves history.
    status: reportStatusEnum("status").notNull().default("pending"),
    // pending = not yet reviewed.
    // reviewed = moderator reviewed and took action.
    // dismissed = moderator reviewed and found no violation.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_reports_queue_item_id").on(table.queueItemId),
    index("idx_reports_reporter_id").on(table.reporterId),
    index("idx_reports_content_type_content_id").on(
      table.contentType,
      table.contentId
    ),
    index("idx_reports_status").on(table.status),
    index("idx_reports_category").on(table.category),
    index("idx_reports_created_at").on(table.createdAt),
  ]
);
