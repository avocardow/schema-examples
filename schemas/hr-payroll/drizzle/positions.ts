// positions: Job positions within the organization, linked to departments.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { departments } from "./departments";

export const positions = pgTable(
  "positions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    departmentId: uuid("department_id").references(
      () => departments.id,
      { onDelete: "set null" }
    ),

    title: text("title").notNull(),
    code: text("code"),
    description: text("description"),
    level: integer("level"),
    payGrade: text("pay_grade"),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_positions_department_id").on(table.departmentId),
    index("idx_positions_is_active").on(table.isActive),
  ]
);
