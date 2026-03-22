// machine_translation_configs: MT provider configurations.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const machine_translation_configs = defineTable({
  name: v.string(),
  engine: v.string(),
  isEnabled: v.boolean(), // Default true.
  isDefault: v.boolean(), // Default false.
  apiKeyRef: v.optional(v.string()),
  endpointUrl: v.optional(v.string()),
  supportedLocales: v.optional(v.any()),
  defaultQualityScore: v.optional(v.number()),
  rateLimit: v.optional(v.number()),
  options: v.optional(v.any()),
  updatedAt: v.number(),
});
