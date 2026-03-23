// authors: Author profiles linked to user accounts.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AuthorDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} displayName
 * @property {string} slug
 * @property {string|null} bio
 * @property {string|null} avatarUrl
 * @property {string|null} websiteUrl
 * @property {Object|null} socialLinks
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createAuthor(fields) {
  return {
    userId: fields.userId,
    displayName: fields.displayName,
    slug: fields.slug,
    bio: fields.bio ?? null,
    avatarUrl: fields.avatarUrl ?? null,
    websiteUrl: fields.websiteUrl ?? null,
    socialLinks: fields.socialLinks ?? {},
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const authorConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      displayName: data.displayName,
      slug: data.slug,
      bio: data.bio ?? null,
      avatarUrl: data.avatarUrl ?? null,
      websiteUrl: data.websiteUrl ?? null,
      socialLinks: data.socialLinks ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - authors: slug ASC (unique)
  - authors: userId ASC
*/
