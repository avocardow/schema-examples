// team_members: Links users to teams within an organization.
// Simpler than organization_members — just a lightweight role string.
// See README.md for full design rationale and field documentation.

import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { users } from "./users";

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role"),                           // Simple team role (e.g., "lead", "member"). Not a FK.
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique().on(table.teamId, table.userId),    // A user can only be in a team once.
    index("idx_team_members_team_id").on(table.teamId),  // "List all members of this team."
    index("idx_team_members_user_id").on(table.userId),  // "Which teams is this user on?"
  ]
);
