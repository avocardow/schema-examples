-- show_categories: Maps podcasts to their assigned categories, with a flag to mark the primary category for display.
-- See README.md for full design rationale.

CREATE TABLE show_categories (
    id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id      UUID    NOT NULL,
    category_id  UUID    NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary   BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (show_id, category_id)
);

ALTER TABLE show_categories
    ADD CONSTRAINT fk_show_categories_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_show_categories_category_id ON show_categories (category_id);
