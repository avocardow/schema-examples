// locale_fallbacks: Fallback chain for locales when translations are missing.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (locale_id, fallback_locale_id) — enforce in reducer logic
// Composite unique: (locale_id, priority) — enforce in reducer logic

#[spacetimedb::table(name = locale_fallbacks, public)]
pub struct LocaleFallback {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub locale_id: String, // FK → locales.id (cascade delete)

    pub fallback_locale_id: String, // FK → locales.id (cascade delete)
    pub priority: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
