// campaigns: Email campaigns with scheduling, A/B testing, and send tracking.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, integer, pgEnum } from "drizzle-orm/pg-core";
import { templates } from "./templates";
import { users } from "./users";

export const campaignStatus = pgEnum("campaign_status", [
  "draft",
  "scheduled",
  "sending",
  "paused",
  "cancelled",
  "sent",
]);

export const campaignType = pgEnum("campaign_type", [
  "regular",
  "ab_test",
]);

export const abTestMetric = pgEnum("ab_test_metric", [
  "open_rate",
  "click_rate",
]);

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    subject: text("subject"),
    fromName: text("from_name"),
    fromEmail: text("from_email"),
    replyTo: text("reply_to"),
    templateId: uuid("template_id").references(() => templates.id, { onDelete: "set null" }),
    htmlBody: text("html_body"),
    textBody: text("text_body"),
    status: campaignStatus("status").notNull().default("draft"),
    campaignType: campaignType("campaign_type").notNull().default("regular"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    abTestWinnerId: uuid("ab_test_winner_id"),
    abTestSamplePct: integer("ab_test_sample_pct"),
    abTestMetric: abTestMetric("ab_test_metric"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_campaigns_status").on(table.status),
    index("idx_campaigns_campaign_type").on(table.campaignType),
    index("idx_campaigns_template_id").on(table.templateId),
    index("idx_campaigns_scheduled_at").on(table.scheduledAt),
    index("idx_campaigns_created_at").on(table.createdAt),
  ],
);
