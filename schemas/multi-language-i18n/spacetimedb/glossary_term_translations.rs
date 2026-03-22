// glossary_term_translations: Translations of glossary terms into target locales.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Draft = initial translation, not yet approved.
/// Approved = reviewed and accepted.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum GlossaryTermStatus {
    Draft,
    Approved,
}

// Composite unique: (term_id, locale_id) — enforce in reducer logic

#[spacetimedb::table(name = glossary_term_translations, public)]
pub struct GlossaryTermTranslation {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub term_id: String, // FK → glossary_terms.id (cascade delete)

    #[index(btree)]
    pub locale_id: String, // FK → locales.id (cascade delete)

    pub translation: String,
    pub notes: Option<String>,
    pub status: GlossaryTermStatus,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
