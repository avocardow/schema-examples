// campaign_links: Tracked URLs within campaigns for click attribution.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = campaign_links, public)]
pub struct CampaignLink {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub campaign_id: String, // UUID, FK → campaigns.id (cascade delete)
    // Composite unique: (campaign_id, original_url) — enforce in reducer logic

    pub original_url: String,
    pub position: Option<i32>,

    pub created_at: Timestamp,
}
