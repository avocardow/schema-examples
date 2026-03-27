// recording_access_grants: Per-user permission grants for accessing recordings.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { recordings } from "./recordings";
import { users } from "./users";

export const recordingPermissionEnum = pgEnum("recording_permission", ["view", "download"]);

export const recordingAccessGrants = pgTable(
  "recording_access_grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recordingId: uuid("recording_id").notNull().references(() => recordings.id, { onDelete: "cascade" }),
    grantedTo: uuid("granted_to").notNull().references(() => users.id, { onDelete: "cascade" }),
    grantedBy: uuid("granted_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    permission: recordingPermissionEnum("permission").notNull().default("view"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_recording_access_grants_recording_id_granted_to").on(table.recordingId, table.grantedTo),
    index("idx_recording_access_grants_granted_to").on(table.grantedTo),
  ]
);
