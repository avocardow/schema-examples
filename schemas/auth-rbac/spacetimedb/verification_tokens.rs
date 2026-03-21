// verification_tokens: Unified one-time tokens for email verification, password reset,
// magic links, phone verification, and platform invitations.
// Org-specific invitations use organization_invitations instead.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum TokenType {
    EmailVerification,
    PhoneVerification,
    PasswordReset,
    MagicLink,
    Invitation, // Platform-level only. Org invitations have their own table.
}

#[spacetimedb::table(name = verification_tokens, public)]
pub struct VerificationToken {
    #[primary_key]
    pub id: String, // UUID

    // Nullable: some tokens exist before a user record (e.g., magic link signup).
    pub user_id: Option<String>, // FK → users.id (cascade delete)

    #[unique]
    pub token_hash: String, // SHA-256 hash. Never store the raw token.

    pub token_type: TokenType,

    // Composite index(identifier, token_type) — enforce in application queries.
    #[index(btree)]
    pub identifier: String, // Email or phone number this token targets.

    #[index(btree)]
    pub expires_at: Timestamp, // Cleanup job: delete expired tokens periodically.

    pub used_at: Option<Timestamp>, // Set when consumed. Prevents replay attacks.
    pub created_at: Timestamp,
}
