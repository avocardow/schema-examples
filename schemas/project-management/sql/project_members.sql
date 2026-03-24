-- project_members: Maps users to projects with role-based access control.
-- See README.md for full design rationale.

CREATE TYPE project_member_role AS ENUM ('owner', 'admin', 'member', 'viewer');

CREATE TABLE project_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL,
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role        project_member_role NOT NULL DEFAULT 'member',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_members_user ON project_members (user_id);

-- Forward FK: projects is defined in projects.sql (loaded after this file).
ALTER TABLE project_members
  ADD CONSTRAINT fk_project_members_project
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE;
