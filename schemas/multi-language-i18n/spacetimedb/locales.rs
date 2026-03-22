// locales: Supported locales/languages for the system.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Ltr = left-to-right text direction.
/// Rtl = right-to-left text direction.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum TextDirection {
    Ltr,
    Rtl,
}

#[spacetimedb::table(name = locales, public)]
pub struct Locale {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub code: String,

    pub name: String,
    pub native_name: Option<String>,
    pub text_direction: TextDirection,
    pub script: Option<String>,
    pub plural_rule: Option<String>,
    pub plural_forms: i32,
    pub is_default: bool,

    #[index(btree)]
    pub is_enabled: bool,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
