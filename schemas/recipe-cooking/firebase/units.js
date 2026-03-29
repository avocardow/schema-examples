// units: Measurement units for recipe ingredients (metric, imperial, universal).
// See README.md for full design rationale.

export const UNIT_SYSTEM = /** @type {const} */ ({
  METRIC:    "metric",
  IMPERIAL:  "imperial",
  UNIVERSAL: "universal",
});

/**
 * @typedef {Object} UnitDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} abbreviation
 * @property {string|null} system
 */

/**
 * @param {Omit<UnitDocument, "id">} fields
 * @returns {Omit<UnitDocument, "id">}
 */
export function createUnit(fields) {
  return {
    name:         fields.name,
    abbreviation: fields.abbreviation ?? null,
    system:       fields.system ?? null,
  };
}

export const unitConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      name:         data.name,
      abbreviation: data.abbreviation ?? null,
      system:       data.system ?? null,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "units"
 *   - name ASC
 *   - system ASC, name ASC
 */
