// benefit_enrollments: Employee enrollment in benefit plans with coverage levels and contributions.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { benefitPlans } from "./benefit_plans";

export const coverageLevelEnum = pgEnum("coverage_level", [
  "employee_only",
  "employee_spouse",
  "employee_children",
  "family",
]);

export const benefitEnrollmentStatusEnum = pgEnum("benefit_enrollment_status", [
  "active",
  "pending",
  "terminated",
  "waived",
]);

export const benefitEnrollments = pgTable(
  "benefit_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    benefitPlanId: uuid("benefit_plan_id")
      .notNull()
      .references(() => benefitPlans.id, { onDelete: "restrict" }),
    coverageLevel: coverageLevelEnum("coverage_level").notNull().default("employee_only"),
    employeeContribution: integer("employee_contribution").notNull().default(0),
    employerContribution: integer("employer_contribution").notNull().default(0),
    currency: text("currency").notNull().default("USD"),
    effectiveDate: text("effective_date").notNull(),
    endDate: text("end_date"),
    status: benefitEnrollmentStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_benefit_enrollments_employee_id").on(table.employeeId),
    index("idx_benefit_enrollments_benefit_plan_id").on(table.benefitPlanId),
    index("idx_benefit_enrollments_status").on(table.status),
    index("idx_benefit_enrollments_effective_date").on(table.effectiveDate),
  ]
);
