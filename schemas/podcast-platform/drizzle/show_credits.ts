// Credits linking people to shows with roles and grouping
// See README.md for full design rationale.

import { pgTable, uuid, integer, unique, index } from "drizzle-orm/pg-core";
import { shows } from "./shows";
import { people } from "./people";
import { creditRoleEnum, creditGroupEnum } from "./episode_credits";

export const showCredits = pgTable(
  "show_credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    personId: uuid("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
    role: creditRoleEnum("role").notNull(),
    group: creditGroupEnum("group").notNull().default("cast"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    unique("uq_show_credits_show_id_person_id_role").on(table.showId, table.personId, table.role),
    index("idx_show_credits_person_id").on(table.personId),
  ]
);
