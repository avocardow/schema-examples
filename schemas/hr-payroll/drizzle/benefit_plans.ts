// benefit_plans: Available benefit plan offerings with contribution details and plan periods.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const benefitPlanTypeEnum = pgEnum("benefit_plan_type", [
  "health",
  "dental",
  "vision",
  "retirement_401k",
  "life_insurance",
  "disability",
  "hsa",
  "fsa",
  "other",
]);

export const benefitPlans = pgTable(
  "benefit_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),
    type: benefitPlanTypeEnum("type").notNull(),
    description: text("description"),

    employerContribution: integer("employer_contribution"),
    employeeContribution: integer("employee_contribution"),

    currency: text("currency").notNull().default("USD"),
    isActive: boolean("is_active").notNull().default(true),

    planYearStart: text("plan_year_start"),
    planYearEnd: text("plan_year_end"),

    metadata: jsonb("metadata"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_benefit_plans_type").on(table.type),
    index("idx_benefit_plans_is_active").on(table.isActive),
  ]
);
