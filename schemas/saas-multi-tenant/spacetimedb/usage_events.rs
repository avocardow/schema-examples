// usage_events: Tracks metered feature usage per organization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = usage_events, public)]
pub struct UsageEvent {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub feature_id: String, // UUID — FK → features.id (cascade delete)

    pub quantity: i32, // default 1, enforced in reducer logic

    pub user_id: Option<String>, // UUID — FK → users.id (set null on delete)

    pub metadata: Option<String>, // JSON stored as string

    #[index(btree)]
    pub idempotency_key: Option<String>,

    pub created_at: Timestamp,

    // Composite index (organization_id, feature_id, created_at) — not supported inline;
    // organization_id and feature_id indexed individually above.
}
