// promo_code_ticket_types: Junction restricting promo codes to specific ticket types.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PromoCodeTicketTypeDocument
 * @property {string} id
 * @property {string} promoCodeId - FK → promo_codes
 * @property {string} ticketTypeId - FK → ticket_types
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PromoCodeTicketTypeDocument, "id" | "createdAt">} fields
 * @returns {Omit<PromoCodeTicketTypeDocument, "id">}
 */
export function createPromoCodeTicketType(fields) {
  return {
    promoCodeId: fields.promoCodeId,
    ticketTypeId: fields.ticketTypeId,
    createdAt: Timestamp.now(),
  };
}

export const promoCodeTicketTypeConverter = {
  /** @param {Omit<PromoCodeTicketTypeDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      promoCodeId: data.promoCodeId,
      ticketTypeId: data.ticketTypeId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "promo_code_ticket_types"
 *   - promoCodeId (ASC), ticketTypeId (ASC)
 *   - ticketTypeId (ASC)
 */
