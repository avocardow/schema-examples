// sessions: User browsing sessions with device, location, and engagement data.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { campaigns } from "./campaigns";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    anonymousId: text("anonymous_id"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    duration: integer("duration"),
    pageCount: integer("page_count").notNull().default(0),
    eventCount: integer("event_count").notNull().default(0),
    isBounce: boolean("is_bounce").notNull().default(true),
    entryUrl: text("entry_url"),
    exitUrl: text("exit_url"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    deviceType: text("device_type"),
    os: text("os"),
    browser: text("browser"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    locale: text("locale"),
    referrer: text("referrer"),
    campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_sessions_user_id_started_at").on(table.userId, table.startedAt),
    index("idx_sessions_anonymous_id").on(table.anonymousId),
    index("idx_sessions_started_at").on(table.startedAt),
    index("idx_sessions_campaign_id").on(table.campaignId),
    index("idx_sessions_country").on(table.country),
    index("idx_sessions_is_bounce").on(table.isBounce),
  ]
);
