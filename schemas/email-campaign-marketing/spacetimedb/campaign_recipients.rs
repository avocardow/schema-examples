// campaign_recipients: Links campaigns to their target lists and segments.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = campaign_recipients, public)]
pub struct CampaignRecipient {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub campaign_id: String, // UUID, FK → campaigns.id (cascade delete)

    #[index(btree)]
    pub list_id: Option<String>, // UUID, FK → contact_lists.id (cascade delete)

    #[index(btree)]
    pub segment_id: Option<String>, // UUID, FK → segments.id (cascade delete)

    pub created_at: Timestamp,
}
