// contact_companies: Join table linking contacts to companies with roles.
// See README.md for full design rationale.
// Composite unique: (contact_id, company_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = contact_companies, public)]
pub struct ContactCompany {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub contact_id: String, // UUID — FK → contacts.id (cascade delete)
    #[index(btree)]
    pub company_id: String, // UUID — FK → companies.id (cascade delete)
    pub role: Option<String>,
    pub is_primary: bool,
    pub created_at: Timestamp,
}
