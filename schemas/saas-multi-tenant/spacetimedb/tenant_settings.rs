// tenant_settings: Per-organization key-value configuration settings.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = tenant_settings, public)]
pub struct TenantSetting {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    pub key: String,
    pub value: String,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // Composite unique: (organization_id, key) — not supported inline, enforce in reducer logic.
}
