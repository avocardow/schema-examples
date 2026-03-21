// accounts: Unified authentication methods. One row per way a user can sign in.
// Combines OAuth, email+password, magic link, and passkey logins in one table.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// Differentiates the authentication mechanism without parsing the provider string.
#[derive(SpacetimeType, Clone)]
pub enum AccountType {
    Oauth,
    Oidc,
    Email,      // Passwordless: magic link or OTP.
    Credential, // Email + password.
    Webauthn,   // Passkey as primary login — not MFA (see mfa_factors for that).
}

#[spacetimedb::table(name = accounts, public)]
pub struct Account {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    // Composite unique(provider, provider_account_id) — enforce in application logic.
    pub provider: String, // e.g., "google", "github", "credential".

    // Composite unique(provider, provider_account_id) — enforce in application logic.
    pub provider_account_id: String, // The user's ID at the provider. For "credential", use the user's email.

    pub account_type: AccountType,

    // Only populated for credential-type accounts. Use bcrypt, scrypt, or argon2id.
    // Never store plaintext passwords.
    pub password_hash: Option<String>,

    // OAuth tokens for calling provider APIs on behalf of the user.
    // SECURITY: these tokens grant access to the user's external accounts — encrypt at rest.
    pub access_token: Option<String>,

    // Provider's refresh token — not to be confused with your own refresh_tokens table.
    // SECURITY: encrypt at rest; rotate on each use.
    pub refresh_token: Option<String>,

    // OIDC ID token. Contains claims about the user. Useful for debugging.
    // SECURITY: encrypt at rest if storing long-term.
    pub id_token: Option<String>,

    pub token_expires_at: Option<Timestamp>,

    // Usually "bearer".
    pub token_type: Option<String>,

    // OAuth scopes granted, e.g., "openid profile email".
    pub scope: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
