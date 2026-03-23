// message_attachments: File references attached to messages.
// See README.md for full design rationale.
import { pgTable, uuid, text, bigint, integer, timestamp, index } from "drizzle-orm/pg-core";
import { messages } from "./messages";
import { files } from "./files";

export const messageAttachments = pgTable(
  "message_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "restrict" }),
    fileName: text("file_name").notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    mimeType: text("mime_type").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("message_attachments_message_id_idx").on(table.messageId),
    index("message_attachments_file_id_idx").on(table.fileId),
  ]
);
