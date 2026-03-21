// refresh_tokens: Long-lived tokens for obtaining new access tokens without re-authentication.
// Uses a parent_id rotation chain: when a token is used it is revoked and a child is issued.
// If a revoked token is reused (indicating theft), the entire chain can be revoked.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = refresh_tokens, public)]
pub struct RefreshToken {
    #[primary_key]
    #[auto_inc]
    pub id: u64, // Bigint for high-volume rotation. Auto-increment for insert performance.

    #[index(btree)]
    pub session_id: String, // FK → sessions.id (cascade delete). Index to revoke all tokens on logout.

    #[unique]
    pub token_hash: String, // Hashed token. The raw token is sent to the client.

    // Rotation chain: points to the token this one replaced.
    // Null = first token in the chain (issued at login).
    // If a revoked token is presented, revoke ALL tokens in the chain (reuse detection).
    #[index(btree)]
    pub parent_id: Option<u64>, // FK → refresh_tokens.id (set null on delete)

    pub revoked: bool,

    pub revoked_at: Option<Timestamp>, // When this token was revoked (rotation or explicit logout).

    pub expires_at: Timestamp, // Typically 7–30 days. Longer than access tokens, shorter than sessions.

    pub created_at: Timestamp,
}
