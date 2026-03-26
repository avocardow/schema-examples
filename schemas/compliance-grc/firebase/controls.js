// controls: security and compliance controls with type, category, and effectiveness tracking.

import { Timestamp } from "firebase/firestore";

export const CONTROL_TYPE = /** @type {const} */ ({
  PREVENTIVE: "preventive",
  DETECTIVE:  "detective",
  CORRECTIVE: "corrective",
  DIRECTIVE:  "directive",
});

export const CONTROL_CATEGORY = /** @type {const} */ ({
  TECHNICAL:      "technical",
  ADMINISTRATIVE: "administrative",
  PHYSICAL:       "physical",
});

export const CONTROL_FREQUENCY = /** @type {const} */ ({
  CONTINUOUS: "continuous",
  DAILY:      "daily",
  WEEKLY:     "weekly",
  MONTHLY:    "monthly",
  QUARTERLY:  "quarterly",
  ANNUALLY:   "annually",
  AS_NEEDED:  "as_needed",
});

export const CONTROL_STATUS = /** @type {const} */ ({
  DRAFT:      "draft",
  ACTIVE:     "active",
  INACTIVE:   "inactive",
  DEPRECATED: "deprecated",
});

export const CONTROL_EFFECTIVENESS = /** @type {const} */ ({
  EFFECTIVE:           "effective",
  PARTIALLY_EFFECTIVE: "partially_effective",
  INEFFECTIVE:         "ineffective",
  NOT_ASSESSED:        "not_assessed",
});

/**
 * @typedef {Object} ControlDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string|null} ownerId        - FK → users
 * @property {string|null} identifier
 * @property {string}      title
 * @property {string|null} description
 * @property {typeof CONTROL_TYPE[keyof typeof CONTROL_TYPE]}            controlType
 * @property {typeof CONTROL_CATEGORY[keyof typeof CONTROL_CATEGORY]}    category
 * @property {typeof CONTROL_FREQUENCY[keyof typeof CONTROL_FREQUENCY]}  frequency
 * @property {typeof CONTROL_STATUS[keyof typeof CONTROL_STATUS]}        status
 * @property {typeof CONTROL_EFFECTIVENESS[keyof typeof CONTROL_EFFECTIVENESS]} effectiveness
 * @property {string|null} implementationNotes
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ControlDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ControlDocument, "id">}
 */
export function createControl(fields) {
  return {
    organizationId:    fields.organizationId    ?? null,
    ownerId:           fields.ownerId           ?? null,
    identifier:        fields.identifier        ?? null,
    title:             fields.title,
    description:       fields.description       ?? null,
    controlType:       fields.controlType,
    category:          fields.category,
    frequency:         fields.frequency         ?? CONTROL_FREQUENCY.CONTINUOUS,
    status:            fields.status            ?? CONTROL_STATUS.DRAFT,
    effectiveness:     fields.effectiveness     ?? CONTROL_EFFECTIVENESS.NOT_ASSESSED,
    implementationNotes: fields.implementationNotes ?? null,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

export const controlConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      organizationId:     data.organizationId    ?? null,
      ownerId:            data.ownerId           ?? null,
      identifier:         data.identifier        ?? null,
      title:              data.title,
      description:        data.description       ?? null,
      controlType:        data.controlType,
      category:           data.category,
      frequency:          data.frequency,
      status:             data.status,
      effectiveness:      data.effectiveness,
      implementationNotes: data.implementationNotes ?? null,
      createdAt:          data.createdAt,
      updatedAt:          data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "controls"
 *   - organizationId ASC, status ASC
 *   - ownerId ASC
 *   - controlType ASC
 *   - category ASC
 *   - identifier ASC (unique)
 */
