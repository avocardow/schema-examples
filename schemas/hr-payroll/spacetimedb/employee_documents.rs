// employee_documents: Tracks documents associated with an employee such as contracts, tax forms, and certifications.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum DocumentType {
    Contract,
    TaxForm,
    Identification,
    Certification,
    OfferLetter,
    PerformanceReview,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum DocumentStatus {
    Active,
    Expired,
    Superseded,
    Archived,
}

#[spacetimedb::table(name = employee_documents, public)]
pub struct EmployeeDocument {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub employee_id: String, // UUID — FK → employees.id (cascade delete)

    #[index(btree)]
    pub file_id: String, // UUID — FK → files.id (cascade delete)

    #[index(btree)]
    pub document_type: DocumentType,

    pub name: String,
    pub description: Option<String>,
    pub issued_date: Option<String>,

    #[index(btree)]
    pub expiry_date: Option<String>,

    #[index(btree)]
    pub status: DocumentStatus, // default Active

    pub uploaded_by: Option<String>, // UUID — FK → users.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
