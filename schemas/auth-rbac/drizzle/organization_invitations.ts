// organization_invitations: Pending invitations to join an organization.
// Separate from organization_members because invitations can exist before the invitee has an account.
// See README.md for full design rationale and field documentation.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { roles } from "./roles";
import { users } from "./users";

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
  "revoked",
]);

export const organizationInvitations = pgTable(
  "organization_invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(), // Invitee's email. They may or may not have an account yet.
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "restrict" }), // Can't delete a role with pending invitations.
    status: invitationStatus("status").notNull().default("pending"),
    tokenHash: text("token_hash").unique().notNull(), // Hashed invitation token. The raw token is sent in the invite email.
    inviterId: uuid("inviter_id").references(() => users.id, { onDelete: "set null" }), // Who sent the invitation. Null if system-generated.
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), // Typically 7 days. After this, the invitee must request a new invitation.
    acceptedAt: timestamp("accepted_at", { withTimezone: true }), // When the invitee accepted.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_organization_invitations_org_status").on(table.organizationId, table.status), // "List pending invitations for this org."
    index("idx_organization_invitations_email").on(table.email), // "Does this email have any pending invitations?" (checked at signup).
    // unique(token_hash) is already created by the field constraint above.
  ]
);
