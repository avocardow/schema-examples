// mfa_factors: Enrolled MFA methods per user (TOTP app, hardware key, SMS, email OTP).
// A user can have multiple factors. Only "verified" factors are accepted for authentication.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum MfaFactorType {
    Totp,
    Webauthn,
    Phone,
    Email,
}

#[derive(SpacetimeType, Clone)]
pub enum MfaFactorStatus {
    Unverified, // Setup started but first code not yet confirmed.
    Verified,   // Active and accepted for authentication.
    Disabled,   // Deactivated by user or admin.
}

#[spacetimedb::table(name = mfa_factors, public)]
pub struct MfaFactor {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub factor_type: MfaFactorType,

    pub friendly_name: Option<String>, // User-assigned label, e.g., "My YubiKey". Shown in the "manage MFA" UI.

    pub status: MfaFactorStatus, // index(user_id, status) — "Does this user have any verified factors?"

    // Only one of the following secrets is populated, depending on factor_type.
    pub secret: Option<String>, // Encrypted TOTP secret. Must be encrypted at rest — not just hashed.
    pub phone: Option<String>,  // E.164 phone number. Only for factor_type=phone.

    // WebAuthn public key credential data. Only for factor_type=webauthn.
    pub webauthn_credential: Option<String>, // JSON-serialized credential data.
    pub webauthn_aaguid: Option<String>, // Authenticator Attestation GUID — identifies the make/model.

    pub last_used_at: Option<Timestamp>, // Useful for detecting stale/unused factors.
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
