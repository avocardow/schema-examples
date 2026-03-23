// user_presence: Online/offline status and custom status for users.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const presenceStatusEnum = pgEnum("presence_status", [
  "online",
  "away",
  "busy",
  "offline",
]);

export const userPresence = pgTable(
  "user_presence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
    status: presenceStatusEnum("status").notNull().default("offline"),
    statusText: text("status_text"),
    statusEmoji: text("status_emoji"),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    lastConnectedAt: timestamp("last_connected_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("user_presence_status_idx").on(table.status),
    index("user_presence_last_active_at_idx").on(table.lastActiveAt),
  ]
);
