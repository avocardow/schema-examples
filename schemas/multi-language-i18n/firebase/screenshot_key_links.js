// screenshot_key_links: Links between screenshots and translation keys with optional coordinates.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ScreenshotKeyLinkDocument
 * @property {string}      id
 * @property {string}      screenshotId
 * @property {string}      translationKeyId
 * @property {number|null} x
 * @property {number|null} y
 * @property {number|null} width
 * @property {number|null} height
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<ScreenshotKeyLinkDocument, "screenshotId" | "translationKeyId"> & Partial<Pick<ScreenshotKeyLinkDocument, "x" | "y" | "width" | "height">>} fields
 * @returns {Omit<ScreenshotKeyLinkDocument, "id">}
 */
export function createScreenshotKeyLink(fields) {
  return {
    screenshotId:     fields.screenshotId,
    translationKeyId: fields.translationKeyId,
    x:                fields.x      ?? null,
    y:                fields.y      ?? null,
    width:            fields.width  ?? null,
    height:           fields.height ?? null,
    createdAt:        Timestamp.now(),
  };
}

export const screenshotKeyLinkConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      screenshotId:     data.screenshotId,
      translationKeyId: data.translationKeyId,
      x:                data.x      ?? null,
      y:                data.y      ?? null,
      width:            data.width  ?? null,
      height:           data.height ?? null,
      createdAt:        data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - screenshot_key_links.screenshotId ASC + screenshot_key_links.translationKeyId ASC (unique)
 *
 * Single-field:
 *   - screenshot_key_links.translationKeyId ASC
 */
