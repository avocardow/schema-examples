// units: Measurement units with system classification for ingredient quantities.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text } from "drizzle-orm/pg-core";

export const unitSystemEnum = pgEnum("unit_system", ["metric", "imperial", "universal"]);

export const units = pgTable(
  "units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    abbreviation: text("abbreviation"),
    system: unitSystemEnum("system"),
  }
);
