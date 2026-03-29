-- recipe_tags: Junction table associating recipes with tags.
-- See README.md for full design rationale.

CREATE TABLE recipe_tags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID NOT NULL,
    tag_id      UUID NOT NULL,
    UNIQUE (recipe_id, tag_id)
);

CREATE INDEX idx_recipe_tags_tag_id ON recipe_tags (tag_id);

-- Forward FK: recipes.sql loads after recipe_tags.sql alphabetically.
ALTER TABLE recipe_tags
    ADD CONSTRAINT fk_recipe_tags_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE;

-- Forward FK: tags.sql loads after recipe_tags.sql alphabetically.
ALTER TABLE recipe_tags
    ADD CONSTRAINT fk_recipe_tags_tag
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE;
