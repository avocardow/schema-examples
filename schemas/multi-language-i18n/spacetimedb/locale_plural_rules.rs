// locale_plural_rules: Plural grammatical rules for locales.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PluralCategory {
    Zero,   // type: String
    One,
    Two,
    Few,
    Many,
    Other,
}

// Composite unique: (locale_id, category) — enforce in reducer logic

#[spacetimedb::table(name = locale_plural_rules, public)]
pub struct LocalePluralRule {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub locale_id: String, // FK → locales.id (cascade delete)

    pub category: PluralCategory,
    pub example: Option<String>,
    pub rule_formula: Option<String>,
    pub created_at: Timestamp,
}
