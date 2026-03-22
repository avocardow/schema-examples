-- auto_detection_results: Results from automated content analysis (ML, hash matching, keyword/regex detection).
-- See README.md for full design rationale.

CREATE TYPE detection_content_type AS ENUM ('post', 'comment', 'message', 'user', 'media');

CREATE TYPE detection_method AS ENUM ('ml_classifier', 'hash_match', 'keyword', 'regex', 'blocklist');

CREATE TABLE auto_detection_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type      detection_content_type NOT NULL,
  content_id        TEXT NOT NULL,                        -- What was analyzed.
  queue_item_id     UUID,                                 -- Queue item created/updated by this detection.
  detection_method  detection_method NOT NULL,             -- Type of detection that produced this result.
  detection_source  TEXT NOT NULL,                         -- Specific detector name (e.g., "perspective", "photodna").
  category          TEXT,                                  -- Detected violation category (e.g., "toxicity", "hate_speech").
  confidence_score  NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
                                                          -- Detection confidence, 0.00 to 1.00. Nullable: binary methods aren't scored.
  matched_value     TEXT,                                  -- What triggered the match (keyword, pattern, hash ID). Null for ML classifiers.
  is_actionable     BOOLEAN NOT NULL DEFAULT FALSE,        -- Whether this result met the threshold for automated action.
  metadata          JSONB DEFAULT '{}',                    -- Detection-specific extra data (per-category scores, hash distances, etc.).
  rule_id           UUID,                                  -- The rule that triggered this detection, if applicable.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()     -- Detections are immutable. No updated_at.
);

-- Forward FK: moderation_queue_items is defined in moderation_queue_items.sql (loaded after this file).
ALTER TABLE auto_detection_results ADD CONSTRAINT fk_auto_detection_results_queue_item_id
  FOREIGN KEY (queue_item_id) REFERENCES moderation_queue_items(id) ON DELETE SET NULL;

-- Forward FK: moderation_rules is defined in moderation_rules.sql (loaded after this file).
ALTER TABLE auto_detection_results ADD CONSTRAINT fk_auto_detection_results_rule_id
  FOREIGN KEY (rule_id) REFERENCES moderation_rules(id) ON DELETE SET NULL;

CREATE INDEX idx_auto_detection_results_content ON auto_detection_results (content_type, content_id);
CREATE INDEX idx_auto_detection_results_queue_item_id ON auto_detection_results (queue_item_id);
CREATE INDEX idx_auto_detection_results_detection_method ON auto_detection_results (detection_method);
CREATE INDEX idx_auto_detection_results_detection_source ON auto_detection_results (detection_source);
CREATE INDEX idx_auto_detection_results_is_actionable ON auto_detection_results (is_actionable);
CREATE INDEX idx_auto_detection_results_created_at ON auto_detection_results (created_at);
