-- moderator_assignments: Default routing rules for assigning content to moderators by scope.
-- See README.md for full design rationale.

CREATE TYPE moderator_assignment_scope AS ENUM ('community', 'channel', 'category');
CREATE TYPE moderator_assignment_role AS ENUM ('moderator', 'senior_moderator', 'admin');

CREATE TABLE moderator_assignments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                       -- The assigned moderator.
                                                       -- Cascade: if moderator is deleted, their assignments are removed.
  scope             moderator_assignment_scope NOT NULL,
                                                       -- What this assignment covers.
                                                       -- community = moderator handles a specific community.
                                                       -- channel = moderator handles a specific channel.
                                                       -- category = moderator handles a specific violation category.
  scope_id          TEXT NOT NULL,                      -- ID of the community, channel, or violation category.
                                                       -- String for external ID support.
  role              moderator_assignment_role NOT NULL DEFAULT 'moderator',
                                                       -- Authority level within this assignment scope.
                                                       -- moderator = standard moderation powers.
                                                       -- senior_moderator = can handle escalations, override decisions.
                                                       -- admin = full authority including moderator management.
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,      -- Whether this assignment is currently active.
  assigned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When this assignment was created.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(moderator_id, scope, scope_id)                -- One assignment per moderator per scope entity.
);

CREATE INDEX idx_moderator_assignments_scope ON moderator_assignments(scope, scope_id);
CREATE INDEX idx_moderator_assignments_is_active ON moderator_assignments(is_active);
