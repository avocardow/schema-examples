// mfa_challenges: In-progress MFA verification attempts.
// Created when a user is prompted for their second factor. Enables rate limiting and replay prevention.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = mfa_challenges, public)]
pub struct MfaChallenge {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub factor_id: String, // FK → mfa_factors.id (cascade delete)

    // Hashed server-generated OTP code. Only for SMS/email factors.
    // Null for TOTP (time-based) and WebAuthn (session-data-based).
    pub otp_code: Option<String>,

    // WebAuthn challenge session data needed to verify the response.
    pub webauthn_session_data: Option<String>, // JSON-serialized.

    pub verified_at: Option<Timestamp>, // Null = pending. Set when user successfully verifies.

    #[index(btree)]
    pub expires_at: Timestamp, // Cleanup job: delete expired challenges.

    pub ip_address: Option<String>, // Where the challenge was initiated. Useful for fraud detection.
    pub created_at: Timestamp,
}
