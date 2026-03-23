-- follow_requests: Pending follow requests for private accounts.
-- See README.md for full design rationale and field documentation.

CREATE TYPE follow_request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE follow_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  target_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  status        follow_request_status NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (requester_id, target_id)
);

CREATE INDEX idx_follow_requests_target_id_status ON follow_requests (target_id, status);
