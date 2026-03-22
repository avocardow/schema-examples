// metric_definitions: Semantic metrics layer.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const METRIC_AGGREGATION = /** @type {const} */ ({
  COUNT:        "count",
  SUM:          "sum",
  AVERAGE:      "average",
  MIN:          "min",
  MAX:          "max",
  COUNT_UNIQUE: "count_unique",
  PERCENTILE:   "percentile",
});

/**
 * @typedef {Object} MetricDefinitionDocument
 * @property {string}      id
 * @property {string}      name
 * @property {string}      displayName
 * @property {string|null} description
 * @property {string}      aggregation
 * @property {string|null} eventTypeId  - FK → event_types
 * @property {string|null} propertyKey
 * @property {Object|null} filters
 * @property {string|null} unit
 * @property {string|null} format
 * @property {boolean}     isActive
 * @property {string}      createdBy    - FK → users
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<MetricDefinitionDocument, "name" | "displayName" | "aggregation" | "createdBy"> & Partial<Pick<MetricDefinitionDocument, "description" | "eventTypeId" | "propertyKey" | "filters" | "unit" | "format" | "isActive">>} fields
 * @returns {Omit<MetricDefinitionDocument, "id">}
 */
export function createMetricDefinition(fields) {
  return {
    name:        fields.name,
    displayName: fields.displayName,
    description: fields.description ?? null,
    aggregation: fields.aggregation,
    eventTypeId: fields.eventTypeId ?? null,
    propertyKey: fields.propertyKey ?? null,
    filters:     fields.filters     ?? null,
    unit:        fields.unit        ?? null,
    format:      fields.format      ?? null,
    isActive:    fields.isActive    ?? true,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const metricDefinitionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      displayName: data.displayName,
      description: data.description ?? null,
      aggregation: data.aggregation,
      eventTypeId: data.eventTypeId ?? null,
      propertyKey: data.propertyKey ?? null,
      filters:     data.filters     ?? null,
      unit:        data.unit        ?? null,
      format:      data.format      ?? null,
      isActive:    data.isActive,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - metric_definitions.name        ASC
 *   - metric_definitions.aggregation ASC
 *   - metric_definitions.eventTypeId ASC
 *   - metric_definitions.isActive    ASC
 *   - metric_definitions.createdBy   ASC
 */
