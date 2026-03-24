// company_tags: Join table linking companies to tags.
// See README.md for full design rationale.
// Composite unique: (company_id, tag_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = company_tags, public)]
pub struct CompanyTag {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub company_id: String, // UUID — FK → companies.id (cascade delete)
    #[index(btree)]
    pub tag_id: String, // UUID — FK → tags.id (cascade delete)
    pub created_at: Timestamp,
}
