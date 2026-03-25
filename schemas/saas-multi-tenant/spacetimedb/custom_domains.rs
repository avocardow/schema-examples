// custom_domains: Custom domains mapped to tenant organizations with DNS verification and SSL tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VerificationMethod {
    Cname, // type: String
    Txt,
}

#[derive(SpacetimeType, Clone)]
pub enum SslStatus {
    Pending, // type: String
    Active,
    Failed,
    Expired,
}

#[spacetimedb::table(name = custom_domains, public)]
pub struct CustomDomain {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    #[unique]
    pub domain: String,

    pub verification_method: VerificationMethod, // default: Cname
    pub verification_token: String,
    pub is_verified: bool,             // default: false
    pub verified_at: Option<Timestamp>,

    pub ssl_status: SslStatus,          // default: Pending
    pub ssl_expires_at: Option<Timestamp>,

    pub is_primary: bool,              // default: false

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
