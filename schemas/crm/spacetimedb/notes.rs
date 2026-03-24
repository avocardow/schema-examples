// notes: Free-text notes attached to contacts, companies, deals, or leads.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notes, public)]
pub struct Note {
    #[primary_key]
    pub id: String, // UUID
    pub content: String,
    #[index(btree)]
    pub contact_id: Option<String>, // UUID — FK → contacts.id (cascade delete)
    #[index(btree)]
    pub company_id: Option<String>, // UUID — FK → companies.id (cascade delete)
    #[index(btree)]
    pub deal_id: Option<String>, // UUID — FK → deals.id (cascade delete)
    #[index(btree)]
    pub lead_id: Option<String>, // UUID — FK → leads.id (cascade delete)
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
