// saml_providers: Enterprise SSO extension for SAML-based identity providers.
// Extends oauth_providers — a SAML provider is another SSO strategy, not a separate concept.
// The parent oauth_providers document holds shared config; this document holds SAML-specific details.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "saml_providers"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - The certificate field contains the IdP's X.509 signing cert used to verify SAML assertions.
 *     Store it as-is (PEM-encoded); it is public-key material and does not require encryption.
 *   - metadataXml may contain sensitive IdP configuration; restrict writes to admins only.
 *   - entityId must be globally unique — enforce this with a transaction before writing.
 */

/**
 * @typedef {Object} SamlProviderDocument
 * @property {string}      oauthProviderId   - Reference to the parent oauth_providers document.
 * @property {string}      entityId          - SAML EntityID from the IdP (e.g., "https://idp.acme.com/saml"). Globally unique.
 * @property {string|null} metadataXml       - Full IdP metadata XML. Either this or metadataUrl is required.
 * @property {string|null} metadataUrl       - URL to fetch IdP metadata (auto-refreshing). Preferred over static XML.
 * @property {string|null} certificate       - IdP's X.509 signing certificate (PEM). Used to verify SAML assertions.
 * @property {string|null} nameIdFormat      - Expected NameID format (e.g., "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress").
 * @property {Object|null} attributeMapping  - Maps IdP attribute names to your user fields.
 *                                             e.g., { "http://schemas.xmlsoap.org/.../emailaddress": "email" }
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Omit<SamlProviderDocument, "createdAt" | "updatedAt">} fields
 * @returns {Omit<SamlProviderDocument, "id">}
 */
export function createSamlProvider(fields) {
  const now = Timestamp.now();
  return {
    oauthProviderId:  fields.oauthProviderId,
    entityId:         fields.entityId,
    metadataXml:      fields.metadataXml      ?? null,
    metadataUrl:      fields.metadataUrl      ?? null,
    certificate:      fields.certificate      ?? null,
    nameIdFormat:     fields.nameIdFormat     ?? null,
    attributeMapping: fields.attributeMapping ?? null,
    createdAt:        now,
    updatedAt:        now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("saml_providers").withConverter(samlProviderConverter)
 */
export const samlProviderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      oauthProviderId:  data.oauthProviderId,
      entityId:         data.entityId,
      metadataXml:      data.metadataXml      ?? null,
      metadataUrl:      data.metadataUrl      ?? null,
      certificate:      data.certificate      ?? null,
      nameIdFormat:     data.nameIdFormat     ?? null,
      attributeMapping: data.attributeMapping ?? null,
      createdAt:        data.createdAt,                 // Timestamp
      updatedAt:        data.updatedAt,                 // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - saml_providers.entityId         ASC  — Must be unique; enforce via transaction before write.
 *   - saml_providers.oauthProviderId  ASC  — Join back to the parent provider.
 */
