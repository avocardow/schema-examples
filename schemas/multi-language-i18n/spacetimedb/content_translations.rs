// content_translations: Translations for dynamic content entities.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Uses TranslationValueStatus from translation_values.rs — do not redefine here.

// Composite unique: (resource_id, entity_id, locale_id, field_name) — enforce in reducer logic
// Composite index: (resource_id, entity_id) — all translations for an entity

#[spacetimedb::table(name = content_translations, public)]
pub struct ContentTranslation {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub resource_id: String, // FK → translatable_resources.id (cascade delete)

    pub entity_id: String,

    #[index(btree)]
    pub locale_id: String, // FK → locales.id (cascade delete)

    pub field_name: String,
    pub value: String,

    #[index(btree)]
    pub status: TranslationValueStatus,

    pub source_digest: Option<String>,
    pub translator_id: Option<String>, // FK → users.id (set null)
    pub version: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
