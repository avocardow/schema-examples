// sso_domains: Maps email domains to SSO providers for automatic login routing.
// When a user with @acme.com signs in, this table routes them to Acme's SSO provider.
// Different from organization_domains: this routes login traffic; that proves domain ownership.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = sso_domains, public)]
pub struct SsoDomain {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub oauth_provider_id: String, // FK → oauth_providers.id (cascade delete)

    #[unique]
    pub domain: String, // e.g., "acme.com". One domain can only map to one provider.

    pub verified: bool, // Has the org proven they own this domain (via DNS TXT record or email)?

    pub verified_at: Option<Timestamp>, // When verification succeeded.

    pub created_at: Timestamp,
}
