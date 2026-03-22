// translation_memory_entries: Reusable translation pairs for translation memory.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index: (source_locale_id, target_locale_id, source_hash) — enforce in reducer logic

#[spacetimedb::table(name = translation_memory_entries, public)]
pub struct TranslationMemoryEntry {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub source_locale_id: String, // FK → locales.id (cascade delete)

    #[index(btree)]
    pub target_locale_id: String, // FK → locales.id (cascade delete)

    pub source_text: String,
    pub target_text: String,
    pub source_hash: String,

    #[index(btree)]
    pub domain: Option<String>,

    pub quality_score: Option<f64>,
    pub usage_count: i32,
    pub source: String,
    pub created_by: Option<String>, // FK → users.id (set null)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
