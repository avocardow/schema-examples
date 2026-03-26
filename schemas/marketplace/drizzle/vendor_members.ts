// vendor_members: Team members associated with a vendor, with role-based access.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";
import { users } from "../../auth-rbac/drizzle/users";

export const vendorMemberRole = pgEnum("vendor_member_role", [
  "owner",
  "admin",
  "editor",
  "viewer",
]);

export const vendorMembers = pgTable(
  "vendor_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: vendorMemberRole("role").notNull().default("viewer"),
    invitedBy: uuid("invited_by").references(() => users.id, {
      onDelete: "set null",
    }),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("idx_vendor_members_vendor_id_user_id").on(
      table.vendorId,
      table.userId
    ),
    index("idx_vendor_members_user_id").on(table.userId),
  ]
);
