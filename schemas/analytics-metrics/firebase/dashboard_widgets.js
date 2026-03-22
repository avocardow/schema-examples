// dashboard_widgets: Widgets within dashboards.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CHART_TYPE = /** @type {const} */ ({
  LINE:   "line",
  BAR:    "bar",
  AREA:   "area",
  PIE:    "pie",
  NUMBER: "number",
  TABLE:  "table",
  FUNNEL: "funnel",
  MAP:    "map",
});

/**
 * @typedef {Object} DashboardWidgetDocument
 * @property {string}      id
 * @property {string}      dashboardId  - FK → dashboards
 * @property {string|null} metricId     - FK → metric_definitions
 * @property {string|null} title
 * @property {string}      chartType
 * @property {Object|null} config
 * @property {number}      positionX
 * @property {number}      positionY
 * @property {number}      width
 * @property {number}      height
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<DashboardWidgetDocument, "dashboardId"> & Partial<Pick<DashboardWidgetDocument, "metricId" | "title" | "chartType" | "config" | "positionX" | "positionY" | "width" | "height">>} fields
 * @returns {Omit<DashboardWidgetDocument, "id">}
 */
export function createDashboardWidget(fields) {
  return {
    dashboardId: fields.dashboardId,
    metricId:    fields.metricId  ?? null,
    title:       fields.title     ?? null,
    chartType:   fields.chartType ?? "line",
    config:      fields.config    ?? null,
    positionX:   fields.positionX ?? 0,
    positionY:   fields.positionY ?? 0,
    width:       fields.width     ?? 6,
    height:      fields.height    ?? 4,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const dashboardWidgetConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      dashboardId: data.dashboardId,
      metricId:    data.metricId  ?? null,
      title:       data.title     ?? null,
      chartType:   data.chartType,
      config:      data.config    ?? null,
      positionX:   data.positionX,
      positionY:   data.positionY,
      width:       data.width,
      height:      data.height,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - dashboard_widgets.dashboardId ASC
 *
 * Composite:
 *   - dashboard_widgets.dashboardId ASC, dashboard_widgets.positionY ASC, dashboard_widgets.positionX ASC
 */
