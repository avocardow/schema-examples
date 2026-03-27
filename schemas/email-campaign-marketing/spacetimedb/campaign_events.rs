// campaign_events: Engagement and delivery events associated with campaign sends.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CampaignEventType {
    // type: String
    Open,
    Click,
    Bounce,
    Complaint,
    Unsubscribe,
}

#[spacetimedb::table(name = campaign_events, public)]
pub struct CampaignEvent {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub send_id: String, // UUID, FK → campaign_sends.id (cascade delete)

    #[index(btree)]
    pub event_type: String, // CampaignEventType enum

    pub link_id: Option<String>, // UUID, FK → campaign_links.id (set null)

    pub metadata: Option<String>, // JSON

    #[index(btree)]
    pub occurred_at: Timestamp,
}
