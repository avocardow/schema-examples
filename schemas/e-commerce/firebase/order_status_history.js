// order_status_history: Records each status transition for an order, providing a full audit trail.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} OrderStatusHistoryDocument
 * @property {string} id
 * @property {string} orderId - FK → orders
 * @property {string|null} fromStatus
 * @property {string} toStatus
 * @property {string|null} changedBy - FK → users
 * @property {string|null} note
 * @property {Timestamp} createdAt
 */

export function createOrderStatusHistory(fields) {
  return {
    orderId: fields.orderId,
    fromStatus: fields.fromStatus ?? null,
    toStatus: fields.toStatus,
    changedBy: fields.changedBy ?? null,
    note: fields.note ?? null,
    createdAt: Timestamp.now(),
  };
}

export const orderStatusHistoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      orderId: data.orderId,
      fromStatus: data.fromStatus ?? null,
      toStatus: data.toStatus,
      changedBy: data.changedBy ?? null,
      note: data.note ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - order_status_history: orderId ASC, createdAt ASC
*/
