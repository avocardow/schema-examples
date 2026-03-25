// tenant_branding: Per-organization visual identity and support contact settings.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = tenant_branding, public)]
pub struct TenantBranding {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    pub logo_url: Option<String>,
    pub logo_dark_url: Option<String>,
    pub favicon_url: Option<String>,
    pub primary_color: Option<String>,
    pub accent_color: Option<String>,
    pub background_color: Option<String>,
    pub custom_css: Option<String>,
    pub support_email: Option<String>,
    pub support_url: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
