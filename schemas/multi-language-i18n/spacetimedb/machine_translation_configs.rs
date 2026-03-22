// machine_translation_configs: Configuration for machine translation engine integrations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = machine_translation_configs, public)]
pub struct MachineTranslationConfig {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub engine: String,
    pub is_enabled: bool,
    pub is_default: bool,
    pub api_key_ref: Option<String>,
    pub endpoint_url: Option<String>,
    pub supported_locales: Option<String>, // JSON
    pub default_quality_score: Option<f64>,
    pub rate_limit: Option<i32>,
    pub options: Option<String>, // JSON
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
