// translation_key_tags: Tags assigned to translation keys for categorization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (translation_key_id, tag) — enforce in reducer logic

#[spacetimedb::table(name = translation_key_tags, public)]
pub struct TranslationKeyTag {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub translation_key_id: String, // FK → translation_keys.id (cascade delete)

    #[index(btree)]
    pub tag: String,

    pub created_at: Timestamp,
}
