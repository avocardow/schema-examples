// machine_translation_configs: Configuration for machine translation engines.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, jsonb, numeric, timestamp } from "drizzle-orm/pg-core";

export const machineTranslationConfigs = pgTable(
  "machine_translation_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    engine: text("engine").notNull(),
    isEnabled: boolean("is_enabled").notNull().default(true),
    isDefault: boolean("is_default").notNull().default(false),
    apiKeyRef: text("api_key_ref"),
    endpointUrl: text("endpoint_url"),
    supportedLocales: jsonb("supported_locales"),
    defaultQualityScore: numeric("default_quality_score", {
      precision: 3,
      scale: 2,
    }),
    rateLimit: integer("rate_limit"),
    options: jsonb("options"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
