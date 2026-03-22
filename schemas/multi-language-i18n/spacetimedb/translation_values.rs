// translation_values: Translated text for each key and locale.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Draft = initial translation, not yet reviewed.
/// InReview = submitted for review.
/// Approved = reviewed and accepted.
/// Published = live and visible to users.
/// Rejected = reviewed and rejected.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum TranslationValueStatus {
    Draft,
    InReview,
    Approved,
    Published,
    Rejected,
}

// Composite unique: (translation_key_id, locale_id, plural_category) — enforce in reducer logic
// Composite index: (locale_id, status) — all published translations for a locale

#[spacetimedb::table(name = translation_values, public)]
pub struct TranslationValue {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub translation_key_id: String, // FK → translation_keys.id (cascade delete)

    #[index(btree)]
    pub locale_id: String, // FK → locales.id (cascade delete)

    pub plural_category: Option<String>,
    pub value: String,

    #[index(btree)]
    pub status: TranslationValueStatus,

    pub is_machine_translated: bool,
    pub source_digest: Option<String>,

    #[index(btree)]
    pub translator_id: Option<String>, // FK → users.id (set null)

    pub reviewed_by: Option<String>, // FK → users.id (set null)
    pub published_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
