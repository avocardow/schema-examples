// custom_field_options: selectable choices for select/multi-select custom fields.
// See README.md for full design rationale.

/**
 * @typedef {Object} CustomFieldOptionDocument
 * @property {string} id
 * @property {string} customFieldId - FK → custom_fields
 * @property {string} label
 * @property {string} value
 * @property {number} sortOrder
 */

/**
 * @param {Omit<CustomFieldOptionDocument, "id">} fields
 * @returns {Omit<CustomFieldOptionDocument, "id">}
 */
export function createCustomFieldOption(fields) {
  return {
    customFieldId: fields.customFieldId,
    label: fields.label,
    value: fields.value,
    sortOrder: fields.sortOrder ?? 0,
  };
}

export const customFieldOptionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      customFieldId: data.customFieldId,
      label: data.label,
      value: data.value,
      sortOrder: data.sortOrder,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "custom_field_options"
 *   - customFieldId ASC, sortOrder ASC
 */
