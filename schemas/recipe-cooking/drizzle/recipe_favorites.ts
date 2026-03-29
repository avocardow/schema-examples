// recipe_favorites: Bookmarks linking users to their favorite recipes.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { users } from "../../auth-rbac/drizzle/users";

export const recipeFavorites = pgTable(
  "recipe_favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_recipe_favorites_recipe_id_user_id").on(table.recipeId, table.userId),
    index("idx_recipe_favorites_user_id").on(table.userId),
  ]
);
