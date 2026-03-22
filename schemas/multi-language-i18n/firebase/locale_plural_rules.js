// locale_plural_rules: Plural grammar rules for locales.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PLURAL_CATEGORY = /** @type {const} */ ({
  ZERO: "zero",
  ONE: "one",
  TWO: "two",
  FEW: "few",
  MANY: "many",
  OTHER: "other",
});

/**
 * @typedef {Object} LocalePluralRuleDocument
 * @property {string}    id
 * @property {string}    localeId - FK → locales
 * @property {typeof PLURAL_CATEGORY[keyof typeof PLURAL_CATEGORY]} category
 * @property {string|null} example
 * @property {string|null} ruleFormula
 * @property {Timestamp} createdAt
 */

/**
 * @param {Pick<LocalePluralRuleDocument, "localeId" | "category"> & Partial<Pick<LocalePluralRuleDocument, "example" | "ruleFormula">>} fields
 * @returns {Omit<LocalePluralRuleDocument, "id">}
 */
export function createLocalePluralRule(fields) {
  return {
    localeId:    fields.localeId,
    category:    fields.category,
    example:     fields.example ?? null,
    ruleFormula: fields.ruleFormula ?? null,
    createdAt:   Timestamp.now(),
  };
}

export const localePluralRuleConverter = {
  /** @param {Omit<LocalePluralRuleDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      localeId:    data.localeId,
      category:    data.category,
      example:     data.example ?? null,
      ruleFormula: data.ruleFormula ?? null,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite unique:
 *   - locale_plural_rules.localeId ASC + locale_plural_rules.category ASC
 */
