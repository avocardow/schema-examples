// conversation_invites: Pending invitations to join private conversations.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { conversations } from "./conversations";
import { users } from "./users";

export const conversationInviteStatusEnum = pgEnum("conversation_invite_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
]);

export const conversationInvites = pgTable(
  "conversation_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    inviteeId: uuid("invitee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: conversationInviteStatusEnum("status").notNull().default("pending"),
    message: text("message"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.conversationId, table.inviteeId, table.status),
    index().on(table.inviteeId, table.status),
    index().on(table.conversationId, table.status),
    index().on(table.expiresAt),
  ]
);
