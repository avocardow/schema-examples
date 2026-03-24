// companies: organizations tracked in the CRM with address and firmographic data.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CompanyDocument
 * @property {string} id
 * @property {string} name
 * @property {string | null} domain
 * @property {string | null} industry
 * @property {number | null} employeeCount
 * @property {number | null} annualRevenue
 * @property {string | null} phone
 * @property {string | null} addressStreet
 * @property {string | null} addressCity
 * @property {string | null} addressState
 * @property {string | null} addressCountry
 * @property {string | null} addressZip
 * @property {string | null} website
 * @property {string | null} description
 * @property {string | null} ownerId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CompanyDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CompanyDocument, "id">}
 */
export function createCompany(fields) {
  return {
    name: fields.name,
    domain: fields.domain ?? null,
    industry: fields.industry ?? null,
    employeeCount: fields.employeeCount ?? null,
    annualRevenue: fields.annualRevenue ?? null,
    phone: fields.phone ?? null,
    addressStreet: fields.addressStreet ?? null,
    addressCity: fields.addressCity ?? null,
    addressState: fields.addressState ?? null,
    addressCountry: fields.addressCountry ?? null,
    addressZip: fields.addressZip ?? null,
    website: fields.website ?? null,
    description: fields.description ?? null,
    ownerId: fields.ownerId ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const companyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      domain: data.domain ?? null,
      industry: data.industry ?? null,
      employeeCount: data.employeeCount ?? null,
      annualRevenue: data.annualRevenue ?? null,
      phone: data.phone ?? null,
      addressStreet: data.addressStreet ?? null,
      addressCity: data.addressCity ?? null,
      addressState: data.addressState ?? null,
      addressCountry: data.addressCountry ?? null,
      addressZip: data.addressZip ?? null,
      website: data.website ?? null,
      description: data.description ?? null,
      ownerId: data.ownerId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "companies"
 *   - domain ASC
 *   - ownerId ASC, createdAt DESC
 *   - industry ASC, createdAt DESC
 */
