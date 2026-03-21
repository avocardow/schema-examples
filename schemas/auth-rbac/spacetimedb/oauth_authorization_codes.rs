// oauth_authorization_codes: Short-lived codes issued during the OAuth authorization code flow.
// Single-use — exchanged for tokens and immediately invalidated. Expire in seconds to minutes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = oauth_authorization_codes, public)]
pub struct OauthAuthorizationCode {
    #[primary_key]
    pub id: String, // UUID

    pub client_id: String, // FK → oauth_clients.id (cascade delete)

    pub user_id: String, // FK → users.id (cascade delete)

    #[unique]
    pub code_hash: String, // Hashed authorization code. Single-use.

    pub redirect_uri: String, // Must exactly match the redirect_uri from the authorization request.

    pub scope: Option<String>, // Scopes granted by the user.

    // PKCE: required for public clients (SPAs, mobile apps).
    // The client sends a code_challenge at authorization time, then proves it at token exchange.
    pub code_challenge: Option<String>,        // The challenge value from the client.
    pub code_challenge_method: Option<String>, // "S256" (recommended) or "plain" (not recommended).

    #[index(btree)]
    pub expires_at: Timestamp, // Very short-lived: 30 seconds to 10 minutes. Cleanup job.

    pub created_at: Timestamp,
}
