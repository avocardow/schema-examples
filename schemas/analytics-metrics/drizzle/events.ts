// events: Raw analytics events with device, location, and attribution data.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { eventTypes } from "./event_types";
import { sessions } from "./sessions";
import { campaigns } from "./campaigns";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventTypeId: uuid("event_type_id").notNull().references(() => eventTypes.id, { onDelete: "restrict" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    anonymousId: text("anonymous_id"),
    sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "set null" }),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
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
    properties: jsonb("properties"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_events_event_type_id").on(table.eventTypeId),
    index("idx_events_user_id_timestamp").on(table.userId, table.timestamp),
    index("idx_events_session_id").on(table.sessionId),
    index("idx_events_timestamp").on(table.timestamp),
    index("idx_events_campaign_id").on(table.campaignId),
    index("idx_events_anonymous_id").on(table.anonymousId),
    index("idx_events_country").on(table.country),
  ]
);
