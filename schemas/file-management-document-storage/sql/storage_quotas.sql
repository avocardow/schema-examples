-- storage_quotas: Per-entity storage limits and usage tracking for users, organizations, or buckets.
-- See README.md for full design rationale.

CREATE TYPE storage_quota_entity_type AS ENUM ('user', 'organization', 'bucket');

CREATE TABLE storage_quotas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  entity_type       storage_quota_entity_type NOT NULL,
  entity_id         UUID NOT NULL,                     -- Polymorphic — references users, organizations, or storage_buckets depending on entity_type.

  quota_bytes       BIGINT NOT NULL,                   -- Storage limit in bytes. Enforced at upload time.
  used_bytes        BIGINT NOT NULL DEFAULT 0,         -- Cached: total bytes consumed. Updated on upload/delete.
  file_count        INTEGER NOT NULL DEFAULT 0,        -- Cached: total file count. Updated on upload/delete.
  last_computed_at  TIMESTAMPTZ,                       -- When usage was last recomputed by a background job. Null = never recomputed.

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (entity_type, entity_id)
);

CREATE INDEX idx_storage_quotas_entity_type ON storage_quotas (entity_type);
