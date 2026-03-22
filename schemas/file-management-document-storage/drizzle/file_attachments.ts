// file_attachments: Polymorphic join table — attach files to any entity in any domain.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { files } from "./files";

export const fileAttachments = pgTable(
  "file_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    // Polymorphic target: what entity this file is attached to.
    // Not FKs — the target table depends on the consuming domain.
    recordType: text("record_type").notNull(), // Entity type (e.g., "products", "users", "posts", "tickets").
    recordId: uuid("record_id").notNull(),     // Entity primary key.

    name: text("name").notNull(), // Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
    position: integer("position").notNull().default(0), // Ordering within a slot.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // Attachments are immutable links. No updatedAt.
  },
  (table) => [
    unique("idx_file_attachments_unique_slot").on(
      table.recordType,
      table.recordId,
      table.name,
      table.fileId
    ),
    index("idx_file_attachments_file_id").on(table.fileId),
    index("idx_file_attachments_record_slot").on(
      table.recordType,
      table.recordId,
      table.name
    ),
    index("idx_file_attachments_record").on(table.recordType, table.recordId),
  ]
);
