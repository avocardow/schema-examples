// customers: Billable entities linked to users or organizations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = customers, public)]
pub struct Customer {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)
    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (set null)
    pub name: String,
    pub email: String,
    pub currency: Option<String>,
    pub tax_id: Option<String>,
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
