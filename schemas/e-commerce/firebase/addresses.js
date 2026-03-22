// addresses: User shipping and billing addresses with default-address flags.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AddressDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string|null} label
 * @property {string} firstName
 * @property {string} lastName
 * @property {string|null} company
 * @property {string} addressLine1
 * @property {string|null} addressLine2
 * @property {string} city
 * @property {string|null} region
 * @property {string|null} postalCode
 * @property {string} country
 * @property {string|null} phone
 * @property {boolean} isDefaultShipping
 * @property {boolean} isDefaultBilling
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createAddress(fields) {
  return {
    userId: fields.userId,
    label: fields.label ?? null,
    firstName: fields.firstName,
    lastName: fields.lastName,
    company: fields.company ?? null,
    addressLine1: fields.addressLine1,
    addressLine2: fields.addressLine2 ?? null,
    city: fields.city,
    region: fields.region ?? null,
    postalCode: fields.postalCode ?? null,
    country: fields.country,
    phone: fields.phone ?? null,
    isDefaultShipping: fields.isDefaultShipping ?? false,
    isDefaultBilling: fields.isDefaultBilling ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const addressConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      label: data.label ?? null,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company ?? null,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? null,
      city: data.city,
      region: data.region ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country,
      phone: data.phone ?? null,
      isDefaultShipping: data.isDefaultShipping,
      isDefaultBilling: data.isDefaultBilling,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - addresses: userId ASC
*/
