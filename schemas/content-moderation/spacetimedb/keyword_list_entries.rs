// keyword_list_entries: Individual words/phrases in keyword lists.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum KeywordMatchType {
    Exact,    // type: String
    Contains,
    Regex,
}

#[spacetimedb::table(name = keyword_list_entries, public)]
pub struct KeywordListEntry {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub list_id: String, // FK → keyword_lists.id (cascade delete)

    pub value: String,

    pub match_type: KeywordMatchType,

    pub is_case_sensitive: bool,

    #[index(btree)]
    pub added_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
}

// Composite unique: (list_id, value, match_type) — enforce in reducer logic.
// SpacetimeDB does not support composite unique constraints in the schema.
