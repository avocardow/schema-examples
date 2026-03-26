-- vendor_documents: Uploaded verification documents for vendor onboarding.
-- See README.md for full design rationale.

CREATE TYPE vendor_document_type AS ENUM ('business_license', 'tax_certificate', 'identity_proof', 'bank_statement', 'other');
CREATE TYPE vendor_document_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE vendor_documents (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id        UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    type             vendor_document_type NOT NULL,
    file_url         TEXT NOT NULL,
    file_name        TEXT NOT NULL,
    status           vendor_document_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at      TIMESTAMPTZ,
    expires_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_documents_vendor_id_type ON vendor_documents(vendor_id, type);
CREATE INDEX idx_vendor_documents_status ON vendor_documents(status);
