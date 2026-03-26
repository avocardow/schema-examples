-- vendor_members: Team members associated with a vendor store.
-- See README.md for full design rationale.

CREATE TYPE vendor_member_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

CREATE TABLE vendor_members (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id   UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        vendor_member_role NOT NULL DEFAULT 'viewer',
    invited_by  UUID,
    joined_at   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_vendor_members_invited_by FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uq_vendor_members_vendor_user UNIQUE (vendor_id, user_id)
);

CREATE INDEX idx_vendor_members_user_id ON vendor_members(user_id);
