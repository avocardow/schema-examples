// api_keys: Long-lived credentials for programmatic access (REST APIs, CI/CD, integrations).
// Scoped to a user, an organization, or both. Always store hashed — the raw key is shown only once.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = api_keys, public)]
pub struct ApiKey {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: Option<String>, // FK → users.id (cascade delete). Null for org-level service keys.

    #[index(btree)]
    pub organization_id: Option<String>, // FK → organizations.id (cascade delete). Null for personal keys.

    pub name: String, // Human-readable label (e.g., "CI Deploy Key").

    pub key_prefix: String, // First 8 chars of the raw key. Allows users to identify keys without exposing them.

    #[unique]
    pub key_hash: String, // SHA-256 or similar hash of the full key. Never store the raw key.

    pub scopes: Option<Vec<String>>, // Allowed scopes. Null = inherits all scopes of the owner.

    pub last_used_at: Option<Timestamp>, // Track usage for key hygiene — unused keys should be revoked.
    pub last_used_ip: Option<String>,    // Last IP that used this key.

    pub expires_at: Option<Timestamp>,  // Null = no expiry. Prefer expiring keys for security.
    pub revoked_at: Option<Timestamp>,  // Non-null = key is revoked. Check this before accepting requests.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
