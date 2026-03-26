// dispute_messages: Threaded messages within a dispute conversation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DisputeSenderRole {
    Customer,
    Vendor,
    Admin,
}

// Composite index: (dispute_id, created_at)

#[spacetimedb::table(name = dispute_messages, public)]
pub struct DisputeMessage {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub dispute_id: String, // UUID, FK -> disputes.id (cascade delete)

    pub sender_id: String, // UUID, FK -> users.id (restrict delete)
    pub sender_role: DisputeSenderRole,
    pub body: String,
    pub attachments: Option<String>, // JSON
    pub created_at: Timestamp,
}
