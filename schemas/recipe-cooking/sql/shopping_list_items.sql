-- shopping_list_items: Individual line items on a shopping list.
-- See README.md for full design rationale.

CREATE TABLE shopping_list_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id    UUID NOT NULL REFERENCES shopping_lists (id) ON DELETE CASCADE,
    food_id             UUID REFERENCES foods (id) ON DELETE SET NULL,
    recipe_id           UUID,
    quantity            NUMERIC,
    unit_id             UUID,
    custom_label        TEXT,
    checked             BOOLEAN NOT NULL DEFAULT false,
    position            INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_shopping_list_items_list_checked ON shopping_list_items (shopping_list_id, checked);
CREATE INDEX idx_shopping_list_items_food_id ON shopping_list_items (food_id);

-- Forward FK: recipes.sql loads after shopping_list_items.sql alphabetically.
ALTER TABLE shopping_list_items
    ADD CONSTRAINT fk_shopping_list_items_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE SET NULL;

-- Forward FK: units.sql loads after shopping_list_items.sql alphabetically.
ALTER TABLE shopping_list_items
    ADD CONSTRAINT fk_shopping_list_items_unit
    FOREIGN KEY (unit_id) REFERENCES units (id) ON DELETE SET NULL;
