// suppression_entries: Global suppression list preventing sends to specific emails.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum SuppressionReason {
    // type: String
    HardBounce,
    Complaint,
    Manual,
    ListUnsubscribe,
}

#[spacetimedb::table(name = suppression_entries, public)]
pub struct SuppressionEntry {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub email: String,

    #[index(btree)]
    pub reason: String, // SuppressionReason enum

    pub source_campaign_id: Option<String>, // UUID, FK → campaigns.id (set null)

    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    pub created_at: Timestamp,
}
