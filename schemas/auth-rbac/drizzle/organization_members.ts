// organization_members: Links users to organizations with a role.
// role_id must reference a role with scope=organization (enforced in app logic).
// Member rows are created when an invitation is accepted (see organization_invitations).
// See README.md for full design rationale and field documentation.

import { pgTable, pgEnum, uuid, boolean, jsonb, timestamp, index, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";
import { roles } from "./roles";

export const membershipStatusEnum = pgEnum("membership_status", ["active", "inactive"]);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "restrict" }), // Must be a role with scope=organization. Can't delete a role that's in use.

    // Membership lifecycle: active ↔ inactive.
    // "active" = normal member. "inactive" = suspended but not removed (preserves history).
    // Note: invitations are tracked in `organization_invitations`, not here.
    // Create the member row only when the invitation is accepted.
    // Exception: SCIM-provisioned members may be created directly with status=active.
    status: membershipStatusEnum("status").notNull().default("active"),

    // SCIM provisioning: if true, this membership is managed by an external directory (Okta, Azure AD, etc.).
    // Directory-managed memberships shouldn't be editable through your app's UI.
    directoryManaged: boolean("directory_managed").notNull().default(false),

    customAttributes: jsonb("custom_attributes"), // Org-specific metadata for this member (e.g., department, title within the org).
    invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }), // Who sent the invitation.
    joinedAt: timestamp("joined_at", { withTimezone: true }), // When the user accepted the invitation. May differ from created_at for SCIM-provisioned members.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("organization_members_organization_id_user_id_unique").on(table.organizationId, table.userId), // A user can only be a member of an org once.
    index("idx_organization_members_user_id").on(table.userId), // "Which orgs does this user belong to?"
    index("idx_organization_members_org_status").on(table.organizationId, table.status), // "List active members of this org."
  ]
);
