// deal_tags: Join table linking deals to tags.
// See README.md for full design rationale.
// Composite unique: (deal_id, tag_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = deal_tags, public)]
pub struct DealTag {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub deal_id: String, // UUID — FK → deals.id (cascade delete)
    #[index(btree)]
    pub tag_id: String, // UUID — FK → tags.id (cascade delete)
    pub created_at: Timestamp,
}
