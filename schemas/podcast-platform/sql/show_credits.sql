-- show_credits: Associates people with a show in a credited role (e.g. host, producer, composer), with ordering and grouping for display.
-- See README.md for full design rationale.

-- Uses credit_role from episode_credits.sql
-- Uses credit_group from episode_credits.sql

CREATE TABLE show_credits (
    id          UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id     UUID     NOT NULL,
    person_id   UUID     NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    role        credit_role  NOT NULL,
    group       credit_group NOT NULL DEFAULT 'cast',
    position    INTEGER  NOT NULL DEFAULT 0,
    UNIQUE (show_id, person_id, role)
);

ALTER TABLE show_credits
    ADD CONSTRAINT fk_show_credits_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_show_credits_person_id ON show_credits (person_id);
