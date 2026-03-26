// check_ins: Records of attendee check-ins at events or individual sessions.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { eventSessions } from "./event_sessions";
import { users } from "../../auth-rbac/drizzle/users";

export const checkInMethodEnum = pgEnum("check_in_method", [
  "qr_scan",
  "manual",
  "self_service",
  "auto",
]);

export const checkIns = pgTable(
  "check_ins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => eventSessions.id, {
      onDelete: "set null",
    }),
    checkedInBy: uuid("checked_in_by").references(() => users.id, {
      onDelete: "set null",
    }),
    method: checkInMethodEnum("method").notNull().default("qr_scan"),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_check_ins_ticket_id").on(table.ticketId),
    index("idx_check_ins_session_id_checked_in_at").on(
      table.sessionId,
      table.checkedInAt,
    ),
  ],
);
