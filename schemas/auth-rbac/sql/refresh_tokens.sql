-- refresh_tokens: Long-lived tokens for obtaining new access tokens without re-authentication.
-- Uses parent_id self-reference for rotation chain and token reuse detection.
-- See README.md for full design rationale and field documentation.

CREATE TABLE refresh_tokens (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id      UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  token_hash      TEXT UNIQUE NOT NULL,             -- Hashed token. Raw token sent to client.

  -- Rotation chain: each new token points to the one it replaced.
  -- NULL parent = first token in chain (issued at login).
  parent_id       BIGINT REFERENCES refresh_tokens(id) ON DELETE SET NULL,

  revoked         BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL,             -- Typically 7-30 days.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_session_id ON refresh_tokens (session_id);
CREATE INDEX idx_refresh_tokens_parent_id ON refresh_tokens (parent_id) WHERE parent_id IS NOT NULL;
