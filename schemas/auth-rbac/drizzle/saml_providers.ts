// saml_providers: Enterprise SSO extension for SAML-based identity providers.
// Extends oauth_providers — SAML is just another SSO strategy.
// See README.md for full design rationale and field documentation.

import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { oauthProviders } from "./oauth_providers";

export const samlProviders = pgTable(
  "saml_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    oauthProviderId: uuid("oauth_provider_id").notNull().references(() => oauthProviders.id, { onDelete: "cascade" }),
    entityId: text("entity_id").notNull(),               // SAML EntityID from the IdP (e.g., "https://idp.acme.com/saml").
    metadataXml: text("metadata_xml"),                   // Full IdP metadata XML. Either this or metadata_url is required.
    metadataUrl: text("metadata_url"),                   // URL to fetch IdP metadata (auto-refreshing). Preferred over static XML.
    certificate: text("certificate"),                    // IdP's X.509 signing certificate. Used to verify SAML assertions.
    nameIdFormat: text("name_id_format"),                // Expected NameID format (e.g., "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress").

    // Attribute mapping: maps IdP-specific attribute names to your user fields.
    // Example: { "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "email" }
    attributeMapping: jsonb("attribute_mapping"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique().on(t.entityId),                                              // SAML EntityIDs must be globally unique.
    index("idx_saml_providers_oauth_provider_id").on(t.oauthProviderId), // Join back to the parent provider.
  ],
);
