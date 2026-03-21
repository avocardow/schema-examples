// oauth_providers: External OAuth/SSO provider configuration (Google, GitHub, corporate SAML, etc.).
// This is the "consuming" side — your app is the relying party.
// For when your app acts as an OAuth server, see oauth_clients instead.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = oauth_providers, public)]
pub struct OauthProvider {
    #[primary_key]
    pub id: String, // UUID

    pub name: String, // Display name shown in your UI (e.g., "Google", "Acme Corp SSO").

    #[unique]
    pub slug: String, // URL-safe identifier. Used in callback URLs (e.g., /auth/callback/google).

    pub strategy: String, // "oauth2", "oidc", or "saml". Determines which flow to use.

    pub client_id: String, // OAuth client ID from the provider's developer console.

    // Must be encrypted at rest. Nullable for public clients (mobile/SPA using PKCE without a secret).
    pub client_secret: Option<String>,

    pub authorization_url: Option<String>, // Override for custom/self-hosted providers.
    pub token_url: Option<String>,         // Override for custom providers.
    pub userinfo_url: Option<String>,      // Override for custom providers.

    pub scopes: Vec<String>, // Default scopes to request (e.g., ["openid", "profile", "email"]).

    #[index(btree)]
    pub enabled: bool, // Toggle a provider on/off without deleting its configuration.

    // Organization-scoped SSO: null = available to all users (e.g., "Sign in with Google").
    #[index(btree)]
    pub organization_id: Option<String>, // FK → organizations.id (cascade delete)

    pub metadata: Option<String>, // JSON. Provider-specific config that doesn't fit in standard fields.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
