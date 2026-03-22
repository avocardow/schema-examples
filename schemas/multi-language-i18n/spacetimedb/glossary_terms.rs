// glossary_terms: Domain-specific terminology for consistent translations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index: (source_locale_id, term) — glossary lookup by source locale

#[spacetimedb::table(name = glossary_terms, public)]
pub struct GlossaryTerm {
    #[primary_key]
    pub id: String, // UUID

    pub term: String,
    pub description: Option<String>,
    pub part_of_speech: Option<String>,

    #[index(btree)]
    pub domain: Option<String>,

    #[index(btree)]
    pub source_locale_id: String, // FK → locales.id (restrict delete)

    pub is_forbidden: bool,
    pub is_case_sensitive: bool,
    pub notes: Option<String>,
    pub created_by: Option<String>, // FK → users.id (set null)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
