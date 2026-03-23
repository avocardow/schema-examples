// series: Ordered collections of related posts.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} SeriesDocument
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} coverImageUrl
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createSeries(fields) {
  return {
    title: fields.title,
    slug: fields.slug,
    description: fields.description ?? null,
    coverImageUrl: fields.coverImageUrl ?? null,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const seriesConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      coverImageUrl: data.coverImageUrl ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - series: slug ASC (unique)
  - series: isActive ASC
*/
