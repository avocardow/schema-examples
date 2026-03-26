// vendor_addresses: Physical addresses associated with vendor operations.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENDOR_ADDRESS_TYPE = /** @type {const} */ ({
  BUSINESS: "business",
  WAREHOUSE: "warehouse",
  RETURN: "return",
});

/**
 * @typedef {Object} VendorAddressDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {typeof VENDOR_ADDRESS_TYPE[keyof typeof VENDOR_ADDRESS_TYPE]} type
 * @property {string|null} label
 * @property {string} addressLine1
 * @property {string|null} addressLine2
 * @property {string} city
 * @property {string|null} region
 * @property {string|null} postalCode
 * @property {string} country
 * @property {string|null} phone
 * @property {boolean} isDefault
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorAddressDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<VendorAddressDocument, "id">}
 */
export function createVendorAddress(data) {
  return {
    vendorId: data.vendorId,
    type: data.type,
    label: data.label ?? null,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 ?? null,
    city: data.city,
    region: data.region ?? null,
    postalCode: data.postalCode ?? null,
    country: data.country,
    phone: data.phone ?? null,
    isDefault: data.isDefault ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const vendorAddressConverter = {
  toFirestore(address) {
    const { id, ...data } = address;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      type: data.type,
      label: data.label ?? null,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? null,
      city: data.city,
      region: data.region ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country,
      phone: data.phone ?? null,
      isDefault: data.isDefault,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, type ASC
