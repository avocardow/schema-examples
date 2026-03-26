// check_ins: Records of ticket check-in events at venues or sessions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CHECK_IN_METHODS = /** @type {const} */ ({
  QR_SCAN: "qr_scan",
  MANUAL: "manual",
  SELF_SERVICE: "self_service",
  AUTO: "auto",
});

/**
 * @typedef {Object} CheckInDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string | null} sessionId - FK → event_sessions
 * @property {string | null} checkedInBy - FK → users
 * @property {typeof CHECK_IN_METHODS[keyof typeof CHECK_IN_METHODS]} method
 * @property {import("firebase/firestore").Timestamp} checkedInAt
 */

/**
 * @param {Omit<CheckInDocument, "id" | "checkedInAt">} fields
 * @returns {Omit<CheckInDocument, "id">}
 */
export function createCheckIn(fields) {
  return {
    ticketId: fields.ticketId,
    sessionId: fields.sessionId ?? null,
    checkedInBy: fields.checkedInBy ?? null,
    method: fields.method ?? CHECK_IN_METHODS.QR_SCAN,
    checkedInAt: Timestamp.now(),
  };
}

export const checkInConverter = {
  /** @param {Omit<CheckInDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      sessionId: data.sessionId ?? null,
      checkedInBy: data.checkedInBy ?? null,
      method: data.method,
      checkedInAt: data.checkedInAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "check_ins"
 *   - ticketId (ASC), checkedInAt (DESC)
 *   - sessionId (ASC), checkedInAt (DESC)
 *   - checkedInBy (ASC), checkedInAt (DESC)
 */
