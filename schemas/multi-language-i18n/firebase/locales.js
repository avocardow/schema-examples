// locales: Supported language/region locales for the i18n system.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TEXT_DIRECTION = /** @type {const} */ ({
  LTR: "ltr",
  RTL: "rtl",
});

/**
 * @typedef {Object} LocaleDocument
 * @property {string}      id
 * @property {string}      code
 * @property {string}      name
 * @property {string|null} nativeName
 * @property {string}      textDirection
 * @property {string|null} script
 * @property {string|null} pluralRule
 * @property {number}      pluralForms
 * @property {boolean}     isDefault
 * @property {boolean}     isEnabled
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<LocaleDocument, "code" | "name"> & Partial<Pick<LocaleDocument, "nativeName" | "textDirection" | "script" | "pluralRule" | "pluralForms" | "isDefault" | "isEnabled">>} fields
 * @returns {Omit<LocaleDocument, "id">}
 */
export function createLocale(fields) {
  return {
    code:          fields.code,
    name:          fields.name,
    nativeName:    fields.nativeName    ?? null,
    textDirection: fields.textDirection ?? TEXT_DIRECTION.LTR,
    script:        fields.script        ?? null,
    pluralRule:    fields.pluralRule    ?? null,
    pluralForms:   fields.pluralForms  ?? 2,
    isDefault:     fields.isDefault    ?? false,
    isEnabled:     fields.isEnabled    ?? true,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

export const localeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      code:          data.code,
      name:          data.name,
      nativeName:    data.nativeName    ?? null,
      textDirection: data.textDirection ?? TEXT_DIRECTION.LTR,
      script:        data.script        ?? null,
      pluralRule:    data.pluralRule    ?? null,
      pluralForms:   data.pluralForms  ?? 2,
      isDefault:     data.isDefault    ?? false,
      isEnabled:     data.isEnabled    ?? true,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - locales.code       ASC (unique lookup)
 *   - locales.isEnabled  ASC
 */
