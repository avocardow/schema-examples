// ticket_transfers: Audit trail of ticket ownership changes between users.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_transfers, public)]
pub struct TicketTransfer {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)

    #[index(btree)]
    pub from_user_id: Option<String>, // UUID — FK → users.id (set null)

    pub from_name: String,
    pub from_email: String,

    #[index(btree)]
    pub to_user_id: Option<String>, // UUID — FK → users.id (set null)

    pub to_name: String,
    pub to_email: String,
    pub transferred_at: Timestamp,
    pub notes: Option<String>,
    pub created_at: Timestamp,
}
