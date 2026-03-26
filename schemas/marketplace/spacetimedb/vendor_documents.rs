// vendor_documents: Verification documents uploaded by vendors for compliance review.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VendorDocumentType {
    BusinessLicense,
    TaxCertificate,
    IdentityProof,
    BankStatement,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum VendorDocumentStatus {
    Pending,
    Approved,
    Rejected,
}

#[spacetimedb::table(name = vendor_documents, public)]
pub struct VendorDocument {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    pub document_type: VendorDocumentType,
    pub file_url: String,
    pub file_name: String,
    #[index(btree)]
    pub status: VendorDocumentStatus,
    pub rejection_reason: Option<String>,
    pub reviewed_by: Option<String>, // UUID, FK -> users.id (set null)
    pub reviewed_at: Option<Timestamp>,
    pub expires_at: Option<Timestamp>,
    pub created_at: Timestamp,
}
