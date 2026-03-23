// posts: Blog posts and pages with publishing workflow.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const POST_TYPE = /** @type {const} */ ({
  POST: "post",
  PAGE: "page",
});

export const POST_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  ARCHIVED: "archived",
});

export const POST_VISIBILITY = /** @type {const} */ ({
  PUBLIC: "public",
  PRIVATE: "private",
  PASSWORD_PROTECTED: "password_protected",
});

/**
 * @typedef {Object} PostDocument
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} slug
 * @property {string|null} excerpt
 * @property {string|null} content
 * @property {string|null} featuredImageUrl
 * @property {string} status
 * @property {string} visibility
 * @property {string|null} password
 * @property {boolean} isFeatured
 * @property {boolean} allowComments
 * @property {string|null} metaTitle
 * @property {string|null} metaDescription
 * @property {string|null} ogImageUrl
 * @property {Timestamp|null} publishedAt
 * @property {string} createdBy - FK → users
 * @property {string|null} updatedBy - FK → users
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createPost(fields) {
  return {
    type: fields.type ?? "post",
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt ?? null,
    content: fields.content ?? null,
    featuredImageUrl: fields.featuredImageUrl ?? null,
    status: fields.status ?? "draft",
    visibility: fields.visibility ?? "public",
    password: fields.password ?? null,
    isFeatured: fields.isFeatured ?? false,
    allowComments: fields.allowComments ?? true,
    metaTitle: fields.metaTitle ?? null,
    metaDescription: fields.metaDescription ?? null,
    ogImageUrl: fields.ogImageUrl ?? null,
    publishedAt: fields.publishedAt ?? null,
    createdBy: fields.createdBy,
    updatedBy: fields.updatedBy ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const postConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      type: data.type,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? null,
      content: data.content ?? null,
      featuredImageUrl: data.featuredImageUrl ?? null,
      status: data.status,
      visibility: data.visibility,
      password: data.password ?? null,
      isFeatured: data.isFeatured,
      allowComments: data.allowComments,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      ogImageUrl: data.ogImageUrl ?? null,
      publishedAt: data.publishedAt ?? null,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - posts: slug ASC (unique)
  - posts: status ASC, publishedAt DESC
  - posts: type ASC, status ASC
  - posts: isFeatured ASC, publishedAt DESC
  - posts: createdBy ASC, status ASC
*/
