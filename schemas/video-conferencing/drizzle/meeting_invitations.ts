// meeting_invitations: Invitations sent to users for upcoming meetings.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { meetings } from "./meetings";
import { users } from "./users";

export const invitationStatusEnum = pgEnum("invitation_status", ["pending", "accepted", "declined", "tentative"]);

export const meetingInvitations = pgTable(
  "meeting_invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id").notNull().references(() => meetings.id, { onDelete: "cascade" }),
    inviterId: uuid("inviter_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    inviteeId: uuid("invitee_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: invitationStatusEnum("status").notNull().default("pending"),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_meeting_invitations_meeting_id_invitee_id").on(table.meetingId, table.inviteeId),
    index("idx_meeting_invitations_invitee_id_status").on(table.inviteeId, table.status),
    index("idx_meeting_invitations_meeting_id_status").on(table.meetingId, table.status),
  ]
);
