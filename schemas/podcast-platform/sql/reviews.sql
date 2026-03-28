-- reviews: Stores user-submitted ratings and written reviews for podcast shows.
-- See README.md for full design rationale.

CREATE TABLE reviews (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    show_id     UUID        NOT NULL,
    rating      INTEGER     NOT NULL,
    title       TEXT,
    body        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, show_id)
);

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_reviews_show_id_created_at ON reviews (show_id, created_at);
CREATE INDEX idx_reviews_show_id_rating ON reviews (show_id, rating);
