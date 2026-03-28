// Credits linking people to episodes with roles and grouping
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, integer, unique, index } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";
import { people } from "./people";

export const creditRoleEnum = pgEnum("credit_role", [
  "host",
  "co_host",
  "guest",
  "producer",
  "editor",
  "sound_designer",
  "composer",
  "narrator",
  "researcher",
  "writer",
]);

export const creditGroupEnum = pgEnum("credit_group", [
  "cast",
  "crew",
  "writing",
  "audio_post_production",
  "video_post_production",
]);

export const episodeCredits = pgTable(
  "episode_credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    personId: uuid("person_id").notNull().references(() => people.id, { onDelete: "cascade" }),
    role: creditRoleEnum("role").notNull(),
    group: creditGroupEnum("group").notNull().default("cast"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    unique("uq_episode_credits_episode_id_person_id_role").on(table.episodeId, table.personId, table.role),
    index("idx_episode_credits_person_id").on(table.personId),
  ]
);
