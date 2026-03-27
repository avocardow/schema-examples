// rooms: Persistent or temporary video-conferencing rooms with configurable features.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const roomTypeEnum = pgEnum("room_type", ["permanent", "temporary"]);

export const rooms = pgTable(
  "rooms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    type: roomTypeEnum("type").notNull().default("permanent"),
    maxParticipants: integer("max_participants"),
    enableWaitingRoom: boolean("enable_waiting_room").notNull().default(false),
    enableRecording: boolean("enable_recording").notNull().default(false),
    enableChat: boolean("enable_chat").notNull().default(true),
    enableTranscription: boolean("enable_transcription").notNull().default(false),
    enableBreakoutRooms: boolean("enable_breakout_rooms").notNull().default(false),
    isPrivate: boolean("is_private").notNull().default(false),
    passwordHash: text("password_hash"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_rooms_created_by").on(table.createdBy),
    index("idx_rooms_type").on(table.type),
    index("idx_rooms_is_private").on(table.isPrivate),
  ]
);
