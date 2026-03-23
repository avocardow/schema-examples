// conversation_participants: Membership records linking users to conversations.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, timestamp, boolean, index, unique } from "drizzle-orm/pg-core";
import { conversations } from "./conversations";
import { users } from "./users";

export const conversationParticipantRoleEnum = pgEnum("conversation_participant_role", [
  "owner",
  "admin",
  "moderator",
  "member",
]);

export const conversationNotificationLevelEnum = pgEnum("conversation_notification_level", [
  "all",
  "mentions",
  "none",
]);

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: conversationParticipantRoleEnum("role").notNull().default("member"),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
    notificationLevel: conversationNotificationLevelEnum("notification_level"),
    isMuted: boolean("is_muted").notNull().default(false),
    mutedUntil: timestamp("muted_until", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.conversationId, table.userId),
    index().on(table.userId),
    index().on(table.userId, table.lastReadAt),
  ]
);
