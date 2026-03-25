// ticket_messages: Replies, notes, and system messages on a ticket thread.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TicketMessageType {
    Reply, // type: String
    Note,
    CustomerMessage,
    System,
}

#[derive(SpacetimeType, Clone)]
pub enum TicketMessageChannel {
    Email, // type: String
    Web,
    Api,
    System,
}

#[spacetimedb::table(name = ticket_messages, public)]
pub struct TicketMessage {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    #[index(btree)]
    pub sender_id: Option<String>, // UUID — FK → users.id (set null)
    pub message_type: TicketMessageType,
    pub body: String,
    pub is_private: bool,
    pub channel: TicketMessageChannel,
    pub created_at: Timestamp,
    // Composite index: (ticket_id, created_at) — enforce in reducer logic
}
