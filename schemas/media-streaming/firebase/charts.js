// charts: curated and algorithmic music charts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CHART_TYPE = /** @type {const} */ ({
  TOP: "top",
  VIRAL: "viral",
  NEW_RELEASES: "new_releases",
  TRENDING: "trending",
});

/**
 * @typedef {Object} ChartDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {typeof CHART_TYPE[keyof typeof CHART_TYPE]} chartType
 * @property {string | null} region
 * @property {boolean} isActive
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ChartDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ChartDocument, "id">}
 */
export function createChart(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    chartType: fields.chartType,
    region: fields.region ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const chartConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      chartType: data.chartType,
      region: data.region ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - slug ASC
 *
 * Composite indexes:
 *   - chartType ASC, isActive ASC
 *   - region ASC, chartType ASC, isActive ASC
 */
