// message_reports: User-submitted reports for message moderation.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { users } from "./users";

export const messageReportReasonEnum = pgEnum("message_report_reason", [
  "spam",
  "harassment",
  "hate_speech",
  "violence",
  "misinformation",
  "nsfw",
  "other",
]);

export const messageReportStatusEnum = pgEnum("message_report_status", [
  "pending",
  "reviewed",
  "resolved",
  "dismissed",
]);

export const messageReports = pgTable(
  "message_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: messageReportReasonEnum("reason").notNull(),
    description: text("description"),
    status: messageReportStatusEnum("status").notNull().default("pending"),
    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.messageId, t.reporterId),
    index().on(t.status),
    index().on(t.reporterId),
    index().on(t.reviewedBy),
  ]
);
