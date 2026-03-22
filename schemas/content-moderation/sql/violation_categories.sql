-- violation_categories: Hierarchical taxonomy of content violation types with configurable severity.
-- See README.md for full design rationale.

CREATE TYPE violation_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');

CREATE TABLE violation_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL,                -- Machine-readable identifier (e.g., "hate_speech", "csam").
  display_name    TEXT NOT NULL,                        -- Human-readable label (e.g., "Hate Speech").
  description     TEXT,                                -- Detailed explanation of what this category covers.
  parent_id       UUID REFERENCES violation_categories(id) ON DELETE RESTRICT,
                                                       -- Parent category for hierarchical taxonomy.
                                                       -- Null = top-level category.
                                                       -- Restrict: cannot delete a parent that has children.

  -- info = informational/advisory.
  -- low = minor policy violation.
  -- medium = standard violation.
  -- high = serious violation requiring prompt action.
  -- critical = illegal content, imminent harm — highest priority.
  severity        violation_severity NOT NULL DEFAULT 'medium',

  is_active       BOOLEAN NOT NULL DEFAULT TRUE,       -- Soft-disable without deleting. Inactive categories
                                                       -- cannot be selected for new violations but remain for history.
  sort_order      INTEGER NOT NULL DEFAULT 0,          -- Display ordering within the parent group.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_violation_categories_parent_id ON violation_categories (parent_id);
CREATE INDEX idx_violation_categories_active_sort ON violation_categories (is_active, sort_order);
