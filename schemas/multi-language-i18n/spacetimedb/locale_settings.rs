// locale_settings: Regional formatting preferences per locale.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = locale_settings, public)]
pub struct LocaleSetting {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub locale_id: String, // FK → locales.id (cascade delete)

    pub date_format: Option<String>,
    pub time_format: Option<String>,
    pub number_format: Option<String>,
    pub currency_code: Option<String>,
    pub currency_symbol: Option<String>,
    pub first_day_of_week: i32,
    pub measurement_system: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
