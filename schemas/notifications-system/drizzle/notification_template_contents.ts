// notification_template_contents: Per-channel content variants for a template (email subject + HTML, SMS short text, push title + body, etc.).
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { notificationTemplates } from "./notification_templates";

import { channelType } from "./notification_channels";

export const notificationTemplateContents = pgTable(
  "notification_template_contents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id")
      .notNull()
      .references(() => notificationTemplates.id, { onDelete: "cascade" }),

    channelType: channelType("channel_type").notNull(), // Which channel this content is for.

    subject: text("subject"), // Email subject, push title. Not applicable for SMS or webhook.
    body: text("body").notNull(), // The main content. HTML for email, plain text for SMS, structured for in-app.

    // Channel-specific metadata (provider-specific fields, see README for per-channel examples).
    metadata: jsonb("metadata").default(sql`'{}'`),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("uq_notification_template_contents_template_channel").on(
      table.templateId,
      table.channelType,
    ), // One content variant per channel per template.
    index("idx_notification_template_contents_template_id").on(
      table.templateId,
    ),
  ]
);
