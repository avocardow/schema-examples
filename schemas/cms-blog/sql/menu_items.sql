-- menu_items: Individual navigation links within a menu, supporting hierarchy.
-- See README.md for full design rationale.

CREATE TYPE menu_link_type AS ENUM ('post', 'category', 'custom');

CREATE TABLE menu_items (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id          UUID NOT NULL,
    parent_id        UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    label            TEXT NOT NULL,
    link_type        menu_link_type NOT NULL,
    link_post_id     UUID,
    link_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    link_url         TEXT,
    open_in_new_tab  BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order       INTEGER NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_items_menu_id_parent_id_sort_order ON menu_items (menu_id, parent_id, sort_order);
CREATE INDEX idx_menu_items_link_post_id ON menu_items (link_post_id);
CREATE INDEX idx_menu_items_link_category_id ON menu_items (link_category_id);

-- Forward FK: menus is defined in menus.sql (loaded after menu_items.sql).
ALTER TABLE menu_items ADD CONSTRAINT fk_menu_items_menu_id
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE;

-- Forward FK: posts is defined in posts.sql (loaded after menu_items.sql).
ALTER TABLE menu_items ADD CONSTRAINT fk_menu_items_link_post_id
  FOREIGN KEY (link_post_id) REFERENCES posts(id) ON DELETE CASCADE;
