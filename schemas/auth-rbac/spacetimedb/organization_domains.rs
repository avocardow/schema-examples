// organization_domains: Verified domains owned by an organization.
// Used for auto-join (user with @acme.com is added to Acme org) and branding.
// Different from sso_domains: this proves ownership; sso_domains routes login traffic.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = organization_domains, public)]
pub struct OrganizationDomain {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: String, // FK → organizations.id (cascade delete). Index: "which domains does this org own?"

    #[unique]
    pub domain: String, // e.g., "acme.com". Lowercase, no protocol prefix.

    pub verified: bool, // Only verified domains should trigger auto-join or SSO routing.

    pub verification_method: Option<String>, // "dns" (TXT record), "email" (admin@domain), etc.

    pub verification_token: Option<String>, // The token/value the org must set in DNS or confirm via email.

    pub verified_at: Option<Timestamp>, // When verification succeeded.

    pub created_at: Timestamp,
}
