// deal_contacts: Join table linking deals to contacts with roles.
// See README.md for full design rationale.
// Composite unique: (deal_id, contact_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DealContactRole {
    DecisionMaker, // type: String
    Champion,
    Influencer,
    EndUser,
    Other,
}

#[spacetimedb::table(name = deal_contacts, public)]
pub struct DealContact {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub deal_id: String, // UUID — FK → deals.id (cascade delete)
    #[index(btree)]
    pub contact_id: String, // UUID — FK → contacts.id (cascade delete)
    pub role: DealContactRole,
    pub created_at: Timestamp,
}
