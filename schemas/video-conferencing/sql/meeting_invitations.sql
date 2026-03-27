-- meeting_invitations: Invitations sent to users for upcoming meetings.
-- See README.md for full design rationale and field documentation.

CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'tentative');

CREATE TABLE meeting_invitations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id    UUID NOT NULL REFERENCES meetings (id) ON DELETE CASCADE,
  inviter_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  invitee_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  status        invitation_status NOT NULL DEFAULT 'pending',
  responded_at  TIMESTAMPTZ,
  message       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (meeting_id, invitee_id)
);

CREATE INDEX idx_meeting_invitations_invitee_id_status ON meeting_invitations (invitee_id, status);
CREATE INDEX idx_meeting_invitations_meeting_id_status ON meeting_invitations (meeting_id, status);
