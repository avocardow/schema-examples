// saml_providers: Enterprise SSO extension for SAML-based identity providers.
// Extends oauth_providers — a SAML provider is just another SSO strategy.
// The parent oauth_providers row holds shared config; this table holds SAML-specific details.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = saml_providers, public)]
pub struct SamlProvider {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub oauth_provider_id: String, // FK → oauth_providers.id (cascade delete). Parent provider config.

    #[unique]
    pub entity_id: String, // SAML EntityID from the IdP (e.g., "https://idp.acme.com/saml"). Must be globally unique.

    pub metadata_xml: Option<String>, // Full IdP metadata XML. Either this or metadata_url is required.
    pub metadata_url: Option<String>, // URL to fetch IdP metadata (auto-refreshing). Preferred over static XML.

    pub certificate: Option<String>, // IdP's X.509 signing certificate. Used to verify SAML assertions.

    pub name_id_format: Option<String>, // Expected NameID format (e.g., "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress").

    // Maps IdP-specific attribute names to your user fields.
    // Example: { "http://schemas.xmlsoap.org/.../emailaddress": "email" }
    pub attribute_mapping: Option<String>, // JSON.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
