-- episode_credits: Associates people with podcast episodes in a specific credited role (e.g. host, guest, editor), supporting ordered cast and crew listings shared with show_credits via common enum types.
-- See README.md for full design rationale.

CREATE TYPE credit_role AS ENUM ('host', 'co_host', 'guest', 'producer', 'editor', 'sound_designer', 'composer', 'narrator', 'researcher', 'writer');
CREATE TYPE credit_group AS ENUM ('cast', 'crew', 'writing', 'audio_post_production', 'video_post_production');

CREATE TABLE episode_credits (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id  UUID        NOT NULL,
    person_id   UUID        NOT NULL,
    role        credit_role NOT NULL,
    group       credit_group NOT NULL DEFAULT 'cast',
    position    INTEGER     NOT NULL DEFAULT 0,
    UNIQUE (episode_id, person_id, role)
);

ALTER TABLE episode_credits
    ADD CONSTRAINT fk_episode_credits_episode_id
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE;

ALTER TABLE episode_credits
    ADD CONSTRAINT fk_episode_credits_person_id
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE;

CREATE INDEX idx_episode_credits_person_id ON episode_credits (person_id);
