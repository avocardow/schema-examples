// users: Central identity record. One row per human (or anonymous) user.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = users, public)]
pub struct Users {
    #[primary_key]
    pub id: String, // UUID

    // Always store lowercase. Nullable for anonymous or phone-only users.
    #[unique]
    pub email: Option<String>,
    pub email_verified_at: Option<Timestamp>,

    // E.164 format (e.g., "+15551234567").
    #[unique]
    pub phone: Option<String>,
    pub phone_verified_at: Option<Timestamp>,

    // Display name. Not used for auth.
    pub name: Option<String>,
    pub first_name: Option<String>,
    pub last_name: Option<String>,

    // Unique username; only enforced if your app uses username-based auth.
    #[unique]
    pub username: Option<String>,

    // Avatar / profile picture URL.
    pub image_url: Option<String>,

    // Guest users that can upgrade to full accounts.
    pub is_anonymous: bool,

    // Ban = admin decision (ToS violation). Can be permanent or temporary.
    pub banned: bool,
    pub banned_reason: Option<String>,
    pub banned_until: Option<Timestamp>, // None = permanent ban.

    // Lock = automated response (brute-force protection). Always temporary.
    pub locked: bool,
    pub locked_until: Option<Timestamp>, // Auto-unlock after this time.
    pub failed_login_attempts: i32,      // Reset to 0 on successful login.
    pub last_failed_login_at: Option<Timestamp>,

    // Two-tier metadata prevents privilege escalation via client-side manipulation.
    // Safe to expose to the client (preferences, theme, onboarding state).
    // Server-writable only — stored as a JSON string.
    pub public_metadata: Option<String>,

    // Server-only (Stripe ID, internal notes, feature flags).
    // SECURITY: never send this field to the client.
    pub private_metadata: Option<String>,

    // Link to an external system (e.g., legacy DB, CRM). Useful during migrations.
    #[unique]
    pub external_id: Option<String>,

    pub last_sign_in_at: Option<Timestamp>,
    // Last known IP. Consider privacy regulations before storing.
    pub last_sign_in_ip: Option<String>,
    pub sign_in_count: i32,

    #[index(btree)]
    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // Soft delete: keeps row for audit trails.
    // WARNING: may conflict with GDPR/CCPA hard-delete requirements. See README.md.
    pub deleted_at: Option<Timestamp>,
}
