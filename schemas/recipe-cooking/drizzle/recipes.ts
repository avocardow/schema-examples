// recipes: Core table storing recipe metadata, authorship, and publishing state.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const recipeDifficultyEnum = pgEnum("recipe_difficulty", ["easy", "medium", "hard"]);
export const recipeStatusEnum = pgEnum("recipe_status", ["draft", "published", "archived"]);

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    sourceUrl: text("source_url"),
    sourceName: text("source_name"),
    servings: text("servings"),
    prepTimeMinutes: integer("prep_time_minutes"),
    cookTimeMinutes: integer("cook_time_minutes"),
    totalTimeMinutes: integer("total_time_minutes"),
    difficulty: recipeDifficultyEnum("difficulty"),
    status: recipeStatusEnum("status").notNull().default("draft"),
    language: text("language"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_recipes_created_by").on(table.createdBy),
    index("idx_recipes_status").on(table.status),
    index("idx_recipes_difficulty").on(table.difficulty),
  ]
);
