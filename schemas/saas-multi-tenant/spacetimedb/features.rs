// features: Feature definitions for feature flags, usage limits, and metered capabilities.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum FeatureType {
    Boolean, // type: String
    Limit,
    Metered,
}

#[spacetimedb::table(name = features, public)]
pub struct Feature {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub key: String,

    pub name: String,
    pub description: Option<String>,

    #[index(btree)]
    pub feature_type: FeatureType,

    pub unit: Option<String>,

    #[index(btree)]
    pub is_enabled: bool,

    pub sort_order: i32,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
