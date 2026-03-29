// recipe_activities: Audit log of user actions on recipes for feeds and analytics.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { recipes } from "./recipes";
import { users } from "../../auth-rbac/drizzle/users";

export const recipeActionEnum = pgEnum("recipe_action", [
  "created",
  "updated",
  "published",
  "archived",
  "rated",
  "favorited",
  "added_to_collection",
  "added_to_meal_plan",
]);

export const recipeActivities = pgTable(
  "recipe_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id").references(() => recipes.id, { onDelete: "set null" }),
    actorId: uuid("actor_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    action: recipeActionEnum("action").notNull(),
    details: jsonb("details"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_recipe_activities_recipe_id").on(table.recipeId),
    index("idx_recipe_activities_actor_id").on(table.actorId),
    index("idx_recipe_activities_action").on(table.action),
    index("idx_recipe_activities_occurred_at").on(table.occurredAt),
  ]
);
