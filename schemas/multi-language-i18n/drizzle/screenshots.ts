// screenshots: Uploaded screenshots for visual context on translations.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const screenshots = pgTable(
  "screenshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    filePath: text("file_path").notNull(),
    fileSize: integer("file_size"),
    mimeType: text("mime_type"),
    width: integer("width"),
    height: integer("height"),
    uploadedBy: uuid("uploaded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
