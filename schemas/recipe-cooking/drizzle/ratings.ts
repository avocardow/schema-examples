// ratings: User-submitted scores and optional reviews for recipes.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, unique, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { users } from "../../auth-rbac/drizzle/users";

export const ratings = pgTable(
  "ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    review: text("review"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_ratings_recipe_id_user_id").on(table.recipeId, table.userId),
    index("idx_ratings_user_id").on(table.userId),
  ]
);
