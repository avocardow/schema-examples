// tenant_features: Feature flags and entitlements assigned to each tenant organization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TenantFeatureSource {
    Plan, // type: String
    Override,
    Trial,
    Custom,
}

#[spacetimedb::table(name = tenant_features, public)]
pub struct TenantFeature {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub feature_id: String, // UUID — FK → features.id (cascade delete)

    pub is_enabled: bool, // default: true
    pub limit_value: Option<i32>,

    #[index(btree)]
    pub source: TenantFeatureSource, // default: Plan

    #[index(btree)]
    pub expires_at: Option<Timestamp>,

    pub notes: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // Composite unique: (organization_id, feature_id) — not supported inline, enforce in reducer logic.
}
