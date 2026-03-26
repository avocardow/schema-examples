// control_tests: Records of periodic control testing with results and next test scheduling.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { controls } from "./controls";
import { users } from "./users";

export const controlTestResultEnum = pgEnum("control_test_result", [
  "pass",
  "fail",
  "partial",
  "not_applicable",
]);

export const controlTests = pgTable(
  "control_tests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    controlId: uuid("control_id")
      .notNull()
      .references(() => controls.id, { onDelete: "cascade" }),
    testedBy: uuid("tested_by").references(() => users.id, { onDelete: "set null" }),
    testDate: timestamp("test_date", { withTimezone: true }).notNull(),
    result: controlTestResultEnum("result").notNull(),
    notes: text("notes"),
    nextTestDate: timestamp("next_test_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_control_tests_control_id").on(table.controlId),
    index("idx_control_tests_tested_by").on(table.testedBy),
    index("idx_control_tests_result").on(table.result),
    index("idx_control_tests_test_date").on(table.testDate),
  ]
);
