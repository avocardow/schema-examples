// translation_groups: Groups linking translatable entities to their source locale.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (resource_id, entity_id) — enforce in reducer logic

#[spacetimedb::table(name = translation_groups, public)]
pub struct TranslationGroup {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub resource_id: String, // FK → translatable_resources.id (cascade delete)

    pub entity_id: String,

    #[index(btree)]
    pub source_locale_id: String, // FK → locales.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
