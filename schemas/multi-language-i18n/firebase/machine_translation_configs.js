// machine_translation_configs: Configuration for machine translation engine integrations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MachineTranslationConfigDocument
 * @property {string}        id
 * @property {string}        name
 * @property {string}        engine
 * @property {boolean}       isEnabled
 * @property {boolean}       isDefault
 * @property {string|null}   apiKeyRef
 * @property {string|null}   endpointUrl
 * @property {string[]|null} supportedLocales
 * @property {number|null}   defaultQualityScore
 * @property {number|null}   rateLimit
 * @property {Object|null}   options
 * @property {Timestamp}     createdAt
 * @property {Timestamp}     updatedAt
 */

/**
 * @param {Pick<MachineTranslationConfigDocument, "name" | "engine"> & Partial<Pick<MachineTranslationConfigDocument, "isEnabled" | "isDefault" | "apiKeyRef" | "endpointUrl" | "supportedLocales" | "defaultQualityScore" | "rateLimit" | "options">>} fields
 * @returns {Omit<MachineTranslationConfigDocument, "id">}
 */
export function createMachineTranslationConfig(fields) {
  return {
    name:                fields.name,
    engine:              fields.engine,
    isEnabled:           fields.isEnabled           ?? true,
    isDefault:           fields.isDefault           ?? false,
    apiKeyRef:           fields.apiKeyRef           ?? null,
    endpointUrl:         fields.endpointUrl         ?? null,
    supportedLocales:    fields.supportedLocales    ?? null,
    defaultQualityScore: fields.defaultQualityScore ?? null,
    rateLimit:           fields.rateLimit           ?? null,
    options:             fields.options             ?? null,
    createdAt:           Timestamp.now(),
    updatedAt:           Timestamp.now(),
  };
}

export const machineTranslationConfigConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      name:                data.name,
      engine:              data.engine,
      isEnabled:           data.isEnabled           ?? true,
      isDefault:           data.isDefault           ?? false,
      apiKeyRef:           data.apiKeyRef           ?? null,
      endpointUrl:         data.endpointUrl         ?? null,
      supportedLocales:    data.supportedLocales    ?? null,
      defaultQualityScore: data.defaultQualityScore ?? null,
      rateLimit:           data.rateLimit           ?? null,
      options:             data.options             ?? null,
      createdAt:           data.createdAt,
      updatedAt:           data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - machine_translation_configs.engine    ASC
 *   - machine_translation_configs.isEnabled ASC
 *   - machine_translation_configs.isDefault ASC
 */
