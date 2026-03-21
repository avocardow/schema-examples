// oauth_clients: For when your app acts as an OAuth server (issuing tokens to third-party apps).
// Most apps don't need this — it's for platforms that expose APIs to external developers.
// If you're only consuming OAuth (Google, GitHub), use oauth_providers instead.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = oauth_clients, public)]
pub struct OauthClient {
    #[primary_key]
    pub id: String, // UUID. Also serves as the client_id in OAuth flows.

    pub name: String, // Display name shown on the consent screen.

    pub secret_hash: String, // Hashed client secret. Never store plaintext.

    pub redirect_uris: Vec<String>, // Allowed redirect URIs. Strictly validated during authorization.

    pub grant_types: Vec<String>, // e.g., ["authorization_code", "client_credentials"].

    pub scopes: Vec<String>, // Allowed scopes this client can request.

    // "web" = server-side (can keep secrets). "spa" = public client, must use PKCE.
    // "native" = mobile/desktop. "m2m" = machine-to-machine (no user involved).
    pub app_type: Option<String>,

    #[index(btree)]
    pub organization_id: Option<String>, // FK → organizations.id (cascade delete). Null = platform-level.

    pub is_first_party: bool, // First-party clients skip the consent screen.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
