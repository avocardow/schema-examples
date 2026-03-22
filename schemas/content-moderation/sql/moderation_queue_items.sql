-- moderation_queue_items: Central moderation queue — every item needing human review, regardless of source.
-- See README.md for full design rationale.

CREATE TYPE moderation_queue_item_content_type AS ENUM (
  'post',
  'comment',
  'message',
  'user',
  'media'
);

CREATE TYPE moderation_queue_item_source AS ENUM (
  'user_report',
  'auto_detection',
  'manual'
);

CREATE TYPE moderation_queue_item_status AS ENUM (
  'pending',
  'in_review',
  'resolved',
  'escalated'
);

CREATE TYPE moderation_queue_item_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE moderation_queue_item_resolution AS ENUM (
  'approved',
  'removed',
  'escalated'
);

CREATE TABLE moderation_queue_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type          moderation_queue_item_content_type NOT NULL,  -- What type of content is being reviewed.
  content_id            TEXT NOT NULL,                                -- ID of the flagged content. String, not UUID — supports external ID formats.
  source                moderation_queue_item_source NOT NULL,        -- How this item entered the queue (user report, auto-detection, or manual).
  status                moderation_queue_item_status NOT NULL DEFAULT 'pending',
                                                                      -- pending = awaiting pickup, in_review = under review,
                                                                      -- resolved = decision made, escalated = sent to senior mod.
  priority              moderation_queue_item_priority NOT NULL DEFAULT 'medium',
                                                                      -- Queue ordering. Critical = illegal content, imminent harm.
  assigned_moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- Moderator currently reviewing this item.
  content_snapshot      JSONB,                                         -- Frozen copy of content at time of flagging for evidence preservation.
  report_count          INTEGER NOT NULL DEFAULT 0,                    -- Denormalized from reports table for queue sorting.
  resolution            moderation_queue_item_resolution,              -- Final outcome. Null = not yet resolved.
  resolved_at           TIMESTAMPTZ,                                   -- When the item was resolved. Null = still open.
  resolved_by           UUID REFERENCES users(id) ON DELETE SET NULL,  -- Moderator who resolved this item.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_moderation_queue_items_status_priority_created
  ON moderation_queue_items (status, priority, created_at);
CREATE INDEX idx_moderation_queue_items_content
  ON moderation_queue_items (content_type, content_id);
CREATE INDEX idx_moderation_queue_items_assigned_moderator_id
  ON moderation_queue_items (assigned_moderator_id);
CREATE INDEX idx_moderation_queue_items_source
  ON moderation_queue_items (source);
CREATE INDEX idx_moderation_queue_items_status
  ON moderation_queue_items (status);
CREATE INDEX idx_moderation_queue_items_resolved_at
  ON moderation_queue_items (resolved_at);
