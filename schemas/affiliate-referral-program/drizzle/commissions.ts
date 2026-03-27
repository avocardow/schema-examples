// commissions: Tracks commission records earned by affiliates for conversions.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { conversions } from "./conversions";
import { affiliates } from "./affiliates";
import { programs, commissionType } from "./programs";

export const commissionStatus = pgEnum("commission_status", ["pending", "approved", "paid", "voided"]);

export const commissions = pgTable("commissions", {
    id: uuid("id").primaryKey().defaultRandom(),
    conversionId: uuid("conversion_id").notNull().references(() => conversions.id, { onDelete: "restrict" }),
    affiliateId: uuid("affiliate_id").notNull().references(() => affiliates.id, { onDelete: "restrict" }),
    programId: uuid("program_id").notNull().references(() => programs.id, { onDelete: "restrict" }),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    status: commissionStatus("status").notNull().default("pending"),
    commissionType: commissionType("commission_type").notNull(),
    commissionRate: numeric("commission_rate"),
    commissionFlat: integer("commission_flat"),
    tierLevel: integer("tier_level").notNull().default(1),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
    voidedReason: text("voided_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_commissions_conversion_id").on(table.conversionId),
    index("idx_commissions_affiliate_id_status").on(table.affiliateId, table.status),
    index("idx_commissions_program_id_status").on(table.programId, table.status),
    index("idx_commissions_status").on(table.status),
    index("idx_commissions_created_at").on(table.createdAt),
  ]
);
