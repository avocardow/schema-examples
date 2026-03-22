// translation_keys: Individual translatable string identifiers.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (namespace_id, key) — enforce in reducer logic

#[spacetimedb::table(name = translation_keys, public)]
pub struct TranslationKey {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub namespace_id: String, // FK → namespaces.id (cascade delete)

    pub key: String,
    pub description: Option<String>,
    pub max_length: Option<i32>,

    #[index(btree)]
    pub is_plural: bool,

    pub format: String,
    pub is_hidden: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
