-- seasons: Represents a named season grouping episodes within a podcast show.
-- See README.md for full design rationale.

CREATE TABLE seasons (
    id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id         UUID    NOT NULL,
    season_number   INTEGER NOT NULL,
    name            TEXT,
    description     TEXT,
    artwork_file_id UUID    REFERENCES files(id) ON DELETE SET NULL,
    UNIQUE(show_id, season_number)
);

ALTER TABLE seasons
    ADD CONSTRAINT fk_seasons_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;
