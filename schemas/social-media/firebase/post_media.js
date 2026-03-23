// post_media: media attachments (images, videos, GIFs) linked to posts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const MEDIA_TYPES = /** @type {const} */ ({
  IMAGE: "image",
  VIDEO: "video",
  GIF: "gif",
});

/**
 * @typedef {Object} PostMediaDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} fileId - FK → files
 * @property {typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES]} mediaType
 * @property {number | null} width
 * @property {number | null} height
 * @property {string | null} altText
 * @property {number} position
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PostMediaDocument, "id" | "createdAt">} fields
 * @returns {Omit<PostMediaDocument, "id">}
 */
export function createPostMedia(fields) {
  return {
    postId: fields.postId,
    fileId: fields.fileId,
    mediaType: fields.mediaType,
    width: fields.width ?? null,
    height: fields.height ?? null,
    altText: fields.altText ?? null,
    position: fields.position ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const postMediaConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
      fileId: data.fileId,
      mediaType: data.mediaType,
      width: data.width ?? null,
      height: data.height ?? null,
      altText: data.altText ?? null,
      position: data.position,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - postId    ASC
 *   - fileId    ASC
 *   - mediaType ASC
 *
 * Composite indexes:
 *   - postId ASC, position ASC
 */
