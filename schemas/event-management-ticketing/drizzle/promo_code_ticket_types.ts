// promo_code_ticket_types: Junction table restricting promo codes to specific ticket types.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { promoCodes } from "./promo_codes";
import { ticketTypes } from "./ticket_types";

export const promoCodeTicketTypes = pgTable(
  "promo_code_ticket_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    promoCodeId: uuid("promo_code_id")
      .notNull()
      .references(() => promoCodes.id, { onDelete: "cascade" }),
    ticketTypeId: uuid("ticket_type_id")
      .notNull()
      .references(() => ticketTypes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_promo_code_ticket_types_promo_code_id_ticket_type_id").on(
      table.promoCodeId,
      table.ticketTypeId,
    ),
    index("idx_promo_code_ticket_types_ticket_type_id").on(
      table.ticketTypeId,
    ),
  ],
);
