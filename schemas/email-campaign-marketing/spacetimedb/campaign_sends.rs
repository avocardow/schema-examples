// campaign_sends: Individual send records tracking delivery status per contact.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CampaignSendStatus {
    // type: String
    Queued,
    Sent,
    Delivered,
    Bounced,
    Dropped,
    Deferred,
}

#[spacetimedb::table(name = campaign_sends, public)]
pub struct CampaignSend {
    #[primary_key]
    pub id: String, // UUID

    pub campaign_id: String, // UUID, FK → campaigns.id (cascade delete)
    // Composite unique: (campaign_id, contact_id) — enforce in reducer logic

    #[index(btree)]
    pub contact_id: String, // UUID, FK → contacts.id (cascade delete)

    #[index(btree)]
    pub status: String, // CampaignSendStatus enum

    #[index(btree)]
    pub sent_at: Option<Timestamp>,

    pub delivered_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
