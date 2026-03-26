// vendor_profiles: Extended vendor profile information for storefront display.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} VendorProfileDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {string} displayName
 * @property {string|null} tagline
 * @property {string|null} description
 * @property {string|null} logoUrl
 * @property {string|null} bannerUrl
 * @property {string|null} websiteUrl
 * @property {Object|null} socialLinks
 * @property {string|null} returnPolicy
 * @property {string|null} shippingPolicy
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorProfileDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<VendorProfileDocument, "id">}
 */
export function createVendorProfile(data) {
  return {
    vendorId: data.vendorId,
    displayName: data.displayName,
    tagline: data.tagline ?? null,
    description: data.description ?? null,
    logoUrl: data.logoUrl ?? null,
    bannerUrl: data.bannerUrl ?? null,
    websiteUrl: data.websiteUrl ?? null,
    socialLinks: data.socialLinks ?? null,
    returnPolicy: data.returnPolicy ?? null,
    shippingPolicy: data.shippingPolicy ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const vendorProfileConverter = {
  toFirestore(profile) {
    const { id, ...data } = profile;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      displayName: data.displayName,
      tagline: data.tagline ?? null,
      description: data.description ?? null,
      logoUrl: data.logoUrl ?? null,
      bannerUrl: data.bannerUrl ?? null,
      websiteUrl: data.websiteUrl ?? null,
      socialLinks: data.socialLinks ?? null,
      returnPolicy: data.returnPolicy ?? null,
      shippingPolicy: data.shippingPolicy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC
