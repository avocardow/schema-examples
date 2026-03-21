-- password_history: Optional. For enterprise password policies (e.g., "cannot reuse last 5 passwords").
-- Most apps don't need this. Include for regulated industries (finance, healthcare, government).
-- See README.md for full design rationale and field documentation.

CREATE TABLE password_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  password_hash   TEXT NOT NULL,                    -- Previous password hash. Compared against new passwords to prevent reuse.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_history_user_id_created_at ON password_history (user_id, created_at);
