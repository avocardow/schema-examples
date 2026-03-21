// organizations: Top-level tenant / workspace / company for multi-tenant apps.
// Users belong to organizations through organization_members; each membership carries a role.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = organizations, public)]
pub struct Organization {
    #[primary_key]
    pub id: String, // UUID

    pub name: String, // Display name (e.g., "Acme Corporation").

    #[unique]
    pub slug: String, // URL-safe identifier (e.g., "acme-corp"). Used in URLs: /orgs/acme-corp.

    pub logo_url: Option<String>, // Organization logo for branding.

    #[unique]
    pub external_id: Option<String>, // Your own cross-system reference (billing, CRM).

    #[unique]
    pub stripe_customer_id: Option<String>, // Direct Stripe link. Common enough to warrant its own column.

    pub max_members: Option<i32>, // Plan-based member limit. Null = unlimited. Enforced in app logic.

    pub public_metadata: Option<String>,  // JSON. Client-readable, server-writable.
    pub private_metadata: Option<String>, // JSON. Server-only (e.g., internal billing notes, feature flags).

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    pub deleted_at: Option<Timestamp>, // Soft delete. Same GDPR considerations as users.
}
