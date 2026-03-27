// clicks: Tracks individual clicks on affiliate links with geo/device metadata.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = clicks, public)]
pub struct Click {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub affiliate_link_id: String, // UUID, FK -> affiliate_links.id (cascade delete)
    // Composite index: (affiliate_link_id, created_at) — enforce in reducer logic

    #[unique]
    pub click_id: String,

    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub referer_url: Option<String>,
    pub landing_url: Option<String>,
    pub country: Option<String>,
    pub device_type: Option<String>,
    pub is_unique: bool, // default true

    #[index(btree)]
    pub created_at: Timestamp,
}
