// leads: Prospective contacts not yet converted into full contacts.
// See README.md for full design rationale.
// Uses LeadSource from contacts.rs — do not redefine here.

use spacetimedb::Timestamp;
use crate::contacts::LeadSource;

#[derive(SpacetimeType, Clone)]
pub enum LeadStatus {
    New, // type: String
    Contacted,
    Qualified,
    Unqualified,
    Converted,
}

#[spacetimedb::table(name = leads, public)]
pub struct Lead {
    #[primary_key]
    pub id: String, // UUID
    pub first_name: String,
    pub last_name: String,
    #[unique]
    pub email: String,
    pub phone: Option<String>,
    pub company_name: Option<String>,
    pub title: Option<String>,
    #[index(btree)]
    pub source: Option<LeadSource>,
    #[index(btree)]
    pub status: LeadStatus,
    pub converted_at: Option<Timestamp>,
    pub converted_contact_id: Option<String>, // UUID — FK → contacts.id (set null)
    #[index(btree)]
    pub owner_id: Option<String>, // UUID — FK → users.id (set null)
    pub notes: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
