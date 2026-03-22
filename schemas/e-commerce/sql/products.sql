-- products: Catalog items with status lifecycle, soft-delete, and flexible metadata.
-- See README.md for full design rationale.

CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id        UUID REFERENCES brands(id) ON DELETE SET NULL,
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT,
    status          product_status NOT NULL DEFAULT 'draft',
    product_type    TEXT,
    options         JSONB,
    metadata        JSONB NOT NULL DEFAULT '{}',
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_brand_id ON products (brand_id);
CREATE INDEX idx_products_status_deleted_at ON products (status, deleted_at);
CREATE INDEX idx_products_is_featured ON products (is_featured);
CREATE INDEX idx_products_deleted_at ON products (deleted_at);
CREATE INDEX idx_products_status ON products (status);
