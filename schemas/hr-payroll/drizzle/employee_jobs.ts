// employee_jobs: Tracks job assignments linking employees to positions, departments, and managers.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { employees, employmentTypeEnum } from "./employees";
import { positions } from "./positions";
import { departments } from "./departments";

export const employeeJobs = pgTable(
  "employee_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    positionId: uuid("position_id").references(() => positions.id, {
      onDelete: "set null",
    }),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),
    managerId: uuid("manager_id").references(() => employees.id, {
      onDelete: "set null",
    }),

    title: text("title").notNull(),
    employmentType: employmentTypeEnum("employment_type").notNull(),
    effectiveDate: text("effective_date").notNull(),
    endDate: text("end_date"),
    reason: text("reason"),

    isPrimary: boolean("is_primary").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_employee_jobs_employee_id").on(table.employeeId),
    index("idx_employee_jobs_position_id").on(table.positionId),
    index("idx_employee_jobs_department_id").on(table.departmentId),
    index("idx_employee_jobs_manager_id").on(table.managerId),
    index("idx_employee_jobs_effective_date").on(table.effectiveDate),
  ]
);
