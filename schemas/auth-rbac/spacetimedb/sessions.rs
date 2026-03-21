// sessions: Active login sessions. Tracks *how* the user authenticated, not just *that* they did.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AalLevel {
    Aal1, // Password/OAuth only.
    Aal2, // MFA verified.
    Aal3, // Hardware key verified.
}

#[spacetimedb::table(name = sessions, public)]
pub struct Session {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    #[unique]
    pub token_hash: String, // SHA-256 hash. Never store raw session tokens.

    // Authentication Assurance Level: Aal1 = password/OAuth, Aal2 = MFA verified, Aal3 = hardware key.
    // Gate sensitive actions on this value — e.g., changing password requires Aal2.
    pub aal: AalLevel,

    pub mfa_factor_id: Option<String>, // UUID — which MFA factor elevated this session to aal2+.

    pub ip_address: Option<String>,  // Captured at creation. Useful for new-login security alerts.
    pub user_agent: Option<String>,  // Browser/device info for "manage your sessions" UI.
    pub country_code: Option<String>, // ISO 3166-1 alpha-2, derived from IP.

    // Active org context for multi-tenant apps. Null for single-tenant or org-less users.
    pub organization_id: Option<String>, // UUID

    // Set when an admin is impersonating this user. Show a visible banner in the UI when non-null.
    pub impersonator_id: Option<String>, // UUID

    pub tag: Option<String>, // Free-form label, e.g. "mobile", "api", "admin-panel".

    pub last_active_at: Option<Timestamp>, // Updated periodically, not on every request.

    #[index(btree)]
    pub expires_at: Timestamp,             // Hard expiry. Always check this; don't rely on cookie expiry.

    pub created_at: Timestamp,
}
