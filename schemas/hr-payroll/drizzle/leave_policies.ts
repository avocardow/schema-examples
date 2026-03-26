// leave_policies: Company-defined leave/time-off policy rules and accrual settings.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const leaveTypeEnum = pgEnum("leave_type", [
  "vacation",
  "sick",
  "personal",
  "parental",
  "bereavement",
  "jury_duty",
  "unpaid",
  "other",
]);

export const accrualFrequencyEnum = pgEnum("accrual_frequency", [
  "per_pay_period",
  "monthly",
  "quarterly",
  "annually",
  "none",
]);

export const leavePolicies = pgTable(
  "leave_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: text("name").notNull(),
    type: leaveTypeEnum("type").notNull(),

    accrualRate: numeric("accrual_rate"),
    accrualFrequency: accrualFrequencyEnum("accrual_frequency")
      .notNull()
      .default("none"),
    maxBalance: numeric("max_balance"),
    maxCarryover: numeric("max_carryover"),

    isPaid: boolean("is_paid").notNull().default(true),
    requiresApproval: boolean("requires_approval").notNull().default(true),
    isActive: boolean("is_active").notNull().default(true),

    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_leave_policies_type").on(table.type),
    index("idx_leave_policies_is_active").on(table.isActive),
  ]
);
