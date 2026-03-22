// locale_settings: Locale-specific formatting and regional preferences.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} LocaleSettingDocument
 * @property {string}      id
 * @property {string}      localeId
 * @property {string|null} dateFormat
 * @property {string|null} timeFormat
 * @property {string|null} numberFormat
 * @property {string|null} currencyCode
 * @property {string|null} currencySymbol
 * @property {number}      firstDayOfWeek
 * @property {string|null} measurementSystem
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<LocaleSettingDocument, "localeId"> & Partial<Pick<LocaleSettingDocument, "dateFormat" | "timeFormat" | "numberFormat" | "currencyCode" | "currencySymbol" | "firstDayOfWeek" | "measurementSystem">>} fields
 * @returns {Omit<LocaleSettingDocument, "id">}
 */
export function createLocaleSetting(fields) {
  return {
    localeId:          fields.localeId,
    dateFormat:        fields.dateFormat        ?? null,
    timeFormat:        fields.timeFormat        ?? null,
    numberFormat:      fields.numberFormat      ?? null,
    currencyCode:      fields.currencyCode      ?? null,
    currencySymbol:    fields.currencySymbol    ?? null,
    firstDayOfWeek:    fields.firstDayOfWeek    ?? 1,
    measurementSystem: fields.measurementSystem ?? null,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

export const localeSettingConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      localeId:          data.localeId,
      dateFormat:        data.dateFormat        ?? null,
      timeFormat:        data.timeFormat        ?? null,
      numberFormat:      data.numberFormat      ?? null,
      currencyCode:      data.currencyCode      ?? null,
      currencySymbol:    data.currencySymbol    ?? null,
      firstDayOfWeek:    data.firstDayOfWeek    ?? 1,
      measurementSystem: data.measurementSystem ?? null,
      createdAt:         data.createdAt,
      updatedAt:         data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - locale_settings.localeId ASC (unique)
 */
