-- product_tag_assignments: Junction table linking products to freeform tags.
-- See README.md for full design rationale.

CREATE TABLE product_tag_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id          UUID NOT NULL REFERENCES product_tags(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_product_tag_assignments_product_id_tag_id ON product_tag_assignments (product_id, tag_id);
CREATE INDEX idx_product_tag_assignments_tag_id ON product_tag_assignments (tag_id);
