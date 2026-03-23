// conversation_participants: Junction between conversations and users, tracking role and read state.
// Composite unique on (conversationId, userId) — enforce at the application layer.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "conversation_participants"
 * Document ID: Firestore auto-generated or UUID
 *
 * A deterministic document ID (e.g., `${conversationId}_${userId}`) is recommended to enforce
 * uniqueness on the (conversationId, userId) pair without a transaction.
 *
 * Security notes:
 *   - Only owners and admins should be permitted to change another participant's role.
 *   - mutedUntil is only meaningful when isMuted = true.
 *   - lastReadAt updates should be rate-limited client-side to avoid excessive writes.
 */

/**
 * @typedef {"owner"|"admin"|"moderator"|"member"} ParticipantRole
 */

export const PARTICIPANT_ROLES = /** @type {const} */ ({
  OWNER:     "owner",
  ADMIN:     "admin",
  MODERATOR: "moderator",
  MEMBER:    "member",
});

/**
 * @typedef {"all"|"mentions"|"none"} NotificationLevel
 */

export const NOTIFICATION_LEVELS = /** @type {const} */ ({
  ALL:      "all",
  MENTIONS: "mentions",
  NONE:     "none",
});

/**
 * @typedef {Object} ConversationParticipantDocument
 * @property {string}                  id
 * @property {string}                  conversationId    - FK → conversations
 * @property {string}                  userId            - FK → users
 * @property {ParticipantRole}         role              - Participant's role in the conversation.
 * @property {Timestamp|null}          lastReadAt        - When the user last read the conversation. Null if never read.
 * @property {NotificationLevel|null}  notificationLevel - Notification verbosity preference. Null = inherit default.
 * @property {boolean}                 isMuted           - Whether the conversation is muted for this participant.
 * @property {Timestamp|null}          mutedUntil        - When the mute expires. Null = muted indefinitely (if isMuted=true).
 * @property {Timestamp}               joinedAt          - When the participant joined the conversation.
 * @property {Timestamp}               createdAt
 * @property {Timestamp}               updatedAt
 */

/**
 * @param {Omit<ConversationParticipantDocument, "role" | "isMuted" | "joinedAt" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ConversationParticipantDocument, "id">}
 */
export function createConversationParticipant(fields) {
  const now = Timestamp.now();
  return {
    conversationId:    fields.conversationId,
    userId:            fields.userId,
    role:              "member",
    lastReadAt:        fields.lastReadAt        ?? null,
    notificationLevel: fields.notificationLevel ?? null,
    isMuted:           false,
    mutedUntil:        fields.mutedUntil        ?? null,
    joinedAt:          now,
    createdAt:         now,
    updatedAt:         now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("conversation_participants").withConverter(conversationParticipantConverter)
 */
export const conversationParticipantConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      conversationId:    data.conversationId,
      userId:            data.userId,
      role:              data.role,
      lastReadAt:        data.lastReadAt        ?? null, // Timestamp | null
      notificationLevel: data.notificationLevel ?? null, // NotificationLevel | null
      isMuted:           data.isMuted,
      mutedUntil:        data.mutedUntil        ?? null, // Timestamp | null
      joinedAt:          data.joinedAt,                  // Timestamp
      createdAt:         data.createdAt,                 // Timestamp
      updatedAt:         data.updatedAt,                 // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - conversation_participants.userId            ASC  — "Which conversations does this user belong to?"
 *
 * Composite:
 *   - conversation_participants.userId            ASC
 *     conversation_participants.lastReadAt        ASC
 *     — "User's conversations sorted by read recency (unread-first feeds)."
 *
 * Uniqueness:
 *   Enforce unique(conversationId, userId) at the application layer, or use a deterministic
 *   document ID of `${conversationId}_${userId}` to guarantee it without a transaction.
 */
