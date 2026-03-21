// mfa_recovery_codes: Backup codes for when a user loses access to their MFA device.
// Generated as a batch (e.g., 10 codes) when MFA is first enabled. Each code is a separate row.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = mfa_recovery_codes, public)]
pub struct MfaRecoveryCode {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete). Index to count remaining codes.

    pub code_hash: String, // Hashed recovery code. Plaintext shown once at generation, never again.

    pub used_at: Option<Timestamp>, // Null = available. Set when consumed. A used code cannot be reused.

    pub created_at: Timestamp,
}
