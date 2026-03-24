// companies: Organizations and businesses associated with contacts and deals.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = companies, public)]
pub struct Company {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub domain: Option<String>,
    #[index(btree)]
    pub industry: Option<String>,
    pub employee_count: Option<i32>,
    pub annual_revenue: Option<f64>,
    pub phone: Option<String>,
    pub address_street: Option<String>,
    pub address_city: Option<String>,
    pub address_state: Option<String>,
    pub address_country: Option<String>,
    pub address_zip: Option<String>,
    pub website: Option<String>,
    pub description: Option<String>,
    #[index(btree)]
    pub owner_id: Option<String>, // UUID — FK → users.id (set null)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
