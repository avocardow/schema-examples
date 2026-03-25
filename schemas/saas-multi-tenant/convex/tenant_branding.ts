// tenant_branding: Per-organization visual identity — logos, colors, custom CSS, and support contact info.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tenant_branding = defineTable({
  organizationId: v.id("organizations"),
  logoUrl: v.optional(v.string()),
  logoDarkUrl: v.optional(v.string()),
  faviconUrl: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  backgroundColor: v.optional(v.string()),
  customCss: v.optional(v.string()),
  supportEmail: v.optional(v.string()),
  supportUrl: v.optional(v.string()),
  updatedAt: v.number(),
}).index("by_organization_id", ["organizationId"]);
