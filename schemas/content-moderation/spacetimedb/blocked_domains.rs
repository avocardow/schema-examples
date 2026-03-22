// blocked_domains: Domain-level content blocking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// full = all content from this domain is blocked.
/// media_only = text content allowed, media rejected.
/// report_reject = reports from this domain's users are ignored.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum BlockedDomainBlockType {
    Full,
    MediaOnly,
    ReportReject,
}

#[spacetimedb::table(name = blocked_domains, public)]
pub struct BlockedDomain {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub domain: String, // The blocked domain (e.g., "spam-site.com").

    #[index(btree)]
    pub block_type: BlockedDomainBlockType, // Default: Full — set in reducer logic.

    pub reason: Option<String>, // Why this domain was blocked.
    pub public_comment: Option<String>, // Comment visible to users about why the domain is blocked.
    pub private_comment: Option<String>, // Internal moderator note. Not visible to users.

    #[index(btree)]
    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
