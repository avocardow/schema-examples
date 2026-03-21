// roles: Named sets of permissions with human-readable slugs.
// Two-tier scope: "environment" (app-wide) and "organization" (org-scoped).
// See README.md for full design rationale and field documentation.

import { pgTable, pgEnum, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const roleScopeEnum = pgEnum("role_scope", ["environment", "organization"]);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    slug: text("slug").unique().notNull(), // Human-readable key (e.g., "admin", "org:editor", "viewer"). Used in code.
    name: text("name").notNull(), // Display name for admin UIs (e.g., "Administrator", "Organization Editor").
    description: text("description"), // Explain what this role is for. Shown in role management UI.

    // Scope determines where this role applies:
    // "environment" = app-wide (e.g., super admin, platform support).
    // "organization" = only within an org (e.g., org admin, org editor).
    // This avoids needing separate tables for global roles vs org roles.
    scope: roleScopeEnum("scope").notNull(),

    // System roles (admin, member, viewer) are created at setup and cannot be deleted.
    // Prevents accidental "I deleted the admin role and locked everyone out" scenarios.
    isSystem: boolean("is_system").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // unique(slug) is already created by the field constraint above.
    index("idx_roles_scope").on(table.scope), // "List all organization-scoped roles."
  ]
);
