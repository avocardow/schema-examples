// custom_field_values: EAV-style storage for custom field data on tickets.
// See README.md for full design rationale.

/**
 * @typedef {Object} CustomFieldValueDocument
 * @property {string} id
 * @property {string} customFieldId - FK → custom_fields
 * @property {string} ticketId - FK → tickets
 * @property {string | null} value
 */

/**
 * @param {Omit<CustomFieldValueDocument, "id">} fields
 * @returns {Omit<CustomFieldValueDocument, "id">}
 */
export function createCustomFieldValue(fields) {
  return {
    customFieldId: fields.customFieldId,
    ticketId: fields.ticketId,
    value: fields.value ?? null,
  };
}

export const customFieldValueConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      customFieldId: data.customFieldId,
      ticketId: data.ticketId,
      value: data.value ?? null,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_field_values"
 *   - customFieldId ASC, ticketId ASC (unique)
 *   - ticketId ASC
 */
