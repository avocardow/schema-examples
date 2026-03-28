// chart_entries: track positions within charts over time.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ChartEntryDocument
 * @property {string} id
 * @property {string} chartId - FK → charts
 * @property {string} trackId - FK → tracks
 * @property {number} position
 * @property {number | null} previousPosition
 * @property {number} peakPosition
 * @property {number} weeksOnChart
 * @property {string} chartDate
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ChartEntryDocument, "id" | "createdAt">} fields
 * @returns {Omit<ChartEntryDocument, "id">}
 */
export function createChartEntry(fields) {
  return {
    chartId: fields.chartId,
    trackId: fields.trackId,
    position: fields.position,
    previousPosition: fields.previousPosition ?? null,
    peakPosition: fields.peakPosition,
    weeksOnChart: fields.weeksOnChart ?? 1,
    chartDate: fields.chartDate,
    createdAt: Timestamp.now(),
  };
}

export const chartEntryConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      chartId: data.chartId,
      trackId: data.trackId,
      position: data.position,
      previousPosition: data.previousPosition ?? null,
      peakPosition: data.peakPosition,
      weeksOnChart: data.weeksOnChart,
      chartDate: data.chartDate,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite indexes:
 *   - chartId ASC, chartDate DESC, position ASC
 *   - trackId ASC, chartDate DESC
 *   - chartId ASC, trackId ASC, chartDate DESC
 */
