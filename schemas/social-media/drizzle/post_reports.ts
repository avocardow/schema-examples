// post_reports: User-submitted reports of posts for moderation review.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

export const reportReasonEnum = pgEnum("report_reason", ["spam", "harassment", "hate_speech", "violence", "misinformation", "nsfw", "other"]);
export const reportStatusEnum = pgEnum("report_status", ["pending", "reviewed", "resolved", "dismissed"]);

export const postReports = pgTable(
  "post_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: reportReasonEnum("reason").notNull(),
    description: text("description"),
    status: reportStatusEnum("status").notNull().default("pending"),
    reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_post_reports_post_reporter").on(table.postId, table.reporterId),
    index("idx_post_reports_status").on(table.status),
    index("idx_post_reports_reporter_id").on(table.reporterId),
    index("idx_post_reports_reviewed_by").on(table.reviewedBy),
  ]
);
