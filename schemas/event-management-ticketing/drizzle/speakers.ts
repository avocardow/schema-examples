// speakers: Presenter profiles with biographical and contact information.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const speakers = pgTable(
  "speakers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    email: text("email"),
    bio: text("bio"),
    title: text("title"),
    company: text("company"),
    avatarUrl: text("avatar_url"),
    websiteUrl: text("website_url"),
    twitterHandle: text("twitter_handle"),
    linkedinUrl: text("linkedin_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_speakers_user_id").on(table.userId),
    index("idx_speakers_is_active").on(table.isActive),
  ],
);
