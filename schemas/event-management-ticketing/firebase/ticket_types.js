// ticket_types: Purchasable ticket tiers for an event.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketTypeDocument
 * @property {string} id
 * @property {string} eventId - FK → events
 * @property {string} name
 * @property {string | null} description
 * @property {number} price - Integer price in smallest currency unit (cents)
 * @property {string} currency
 * @property {number | null} quantityTotal
 * @property {number} quantitySold
 * @property {number} minPerOrder
 * @property {number} maxPerOrder
 * @property {import("firebase/firestore").Timestamp | null} saleStartAt
 * @property {import("firebase/firestore").Timestamp | null} saleEndAt
 * @property {boolean} isActive
 * @property {boolean} isHidden
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TicketTypeDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TicketTypeDocument, "id">}
 */
export function createTicketType(fields) {
  return {
    eventId: fields.eventId,
    name: fields.name,
    description: fields.description ?? null,
    price: fields.price ?? 0,
    currency: fields.currency ?? "USD",
    quantityTotal: fields.quantityTotal ?? null,
    quantitySold: fields.quantitySold ?? 0,
    minPerOrder: fields.minPerOrder ?? 1,
    maxPerOrder: fields.maxPerOrder ?? 10,
    saleStartAt: fields.saleStartAt ?? null,
    saleEndAt: fields.saleEndAt ?? null,
    isActive: fields.isActive ?? true,
    isHidden: fields.isHidden ?? false,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ticketTypeConverter = {
  /** @param {Omit<TicketTypeDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      eventId: data.eventId,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      currency: data.currency,
      quantityTotal: data.quantityTotal ?? null,
      quantitySold: data.quantitySold,
      minPerOrder: data.minPerOrder,
      maxPerOrder: data.maxPerOrder,
      saleStartAt: data.saleStartAt ?? null,
      saleEndAt: data.saleEndAt ?? null,
      isActive: data.isActive,
      isHidden: data.isHidden,
      position: data.position,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_types"
 *   - eventId (ASC), position (ASC)
 *   - eventId (ASC), isActive (ASC)
 */
