// kb_articles: self-service knowledge-base content authored by agents.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const KB_ARTICLE_STATUSES = /** @type {const} */ ({
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
});

/**
 * @typedef {Object} KbArticleDocument
 * @property {string} id
 * @property {string | null} categoryId - FK → kb_categories
 * @property {string} title
 * @property {string} slug
 * @property {string} body
 * @property {typeof KB_ARTICLE_STATUSES[keyof typeof KB_ARTICLE_STATUSES]} status
 * @property {string} authorId - FK → users
 * @property {number} viewCount
 * @property {number} helpfulCount
 * @property {number} notHelpfulCount
 * @property {import("firebase/firestore").Timestamp | null} publishedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<KbArticleDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<KbArticleDocument, "id">}
 */
export function createKbArticle(fields) {
  return {
    categoryId: fields.categoryId ?? null,
    title: fields.title,
    slug: fields.slug,
    body: fields.body,
    status: fields.status ?? KB_ARTICLE_STATUSES.DRAFT,
    authorId: fields.authorId,
    viewCount: fields.viewCount ?? 0,
    helpfulCount: fields.helpfulCount ?? 0,
    notHelpfulCount: fields.notHelpfulCount ?? 0,
    publishedAt: fields.publishedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const kbArticleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      categoryId: data.categoryId ?? null,
      title: data.title,
      slug: data.slug,
      body: data.body,
      status: data.status,
      authorId: data.authorId,
      viewCount: data.viewCount,
      helpfulCount: data.helpfulCount,
      notHelpfulCount: data.notHelpfulCount,
      publishedAt: data.publishedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "kb_articles"
 *   - categoryId ASC, createdAt DESC
 *   - status ASC, createdAt DESC
 *   - authorId ASC, createdAt DESC
 */
