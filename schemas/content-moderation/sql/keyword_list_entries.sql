-- keyword_list_entries: Individual words, phrases, or patterns within a keyword list.
-- See README.md for full design rationale.

CREATE TYPE keyword_match_type AS ENUM ('exact', 'contains', 'regex');

CREATE TABLE keyword_list_entries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id           UUID NOT NULL,                       -- Which keyword list this entry belongs to.
                                                         -- FK added via ALTER TABLE below (forward reference).
  value             TEXT NOT NULL,                       -- The word, phrase, or pattern to match against.
  match_type        keyword_match_type NOT NULL DEFAULT 'exact',
                                                         -- exact = full string match.
                                                         -- contains = substring match.
                                                         -- regex = regular expression pattern.
  is_case_sensitive BOOLEAN NOT NULL DEFAULT FALSE,      -- Whether matching is case-sensitive.
  added_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                                                         -- Who added this entry.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (list_id, value, match_type)                    -- Prevent duplicate entries with the same match type.
);

-- Forward FK: keyword_lists is defined in keyword_lists.sql (loaded after keyword_list_entries.sql).
ALTER TABLE keyword_list_entries ADD CONSTRAINT fk_keyword_list_entries_list_id
  FOREIGN KEY (list_id) REFERENCES keyword_lists(id) ON DELETE CASCADE;

CREATE INDEX idx_keyword_list_entries_added_by ON keyword_list_entries (added_by);
