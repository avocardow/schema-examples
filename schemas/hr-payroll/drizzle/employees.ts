// employees: Core employee records with personal details, employment type, and status tracking.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, jsonb, index, unique, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const employmentTypeEnum = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "contractor",
  "intern",
  "temporary",
]);

export const employeeStatusEnum = pgEnum("employee_status", [
  "active",
  "on_leave",
  "suspended",
  "terminated",
]);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    employeeNumber: text("employee_number"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    dateOfBirth: text("date_of_birth"),
    hireDate: text("hire_date").notNull(),
    terminationDate: text("termination_date"),
    employmentType: employmentTypeEnum("employment_type").notNull(),
    status: employeeStatusEnum("status").notNull().default("active"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_employees_employee_number").on(table.employeeNumber),
    index("idx_employees_user_id").on(table.userId),
    index("idx_employees_status").on(table.status),
    index("idx_employees_employment_type").on(table.employmentType),
  ]
);
