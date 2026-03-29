// recipe_images: Photo attachments for recipes with ordering and primary flag.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";

export const recipeImages = pgTable(
  "recipe_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").notNull().references(() => recipes.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    caption: text("caption"),
    isPrimary: boolean("is_primary").notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_recipe_images_recipe_id_position").on(table.recipeId, table.position),
  ]
);
