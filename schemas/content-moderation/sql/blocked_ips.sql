-- blocked_ips: IP-level blocking for preventing access from specific addresses or CIDR ranges.
-- See README.md for full design rationale.

CREATE TYPE blocked_ip_severity AS ENUM ('sign_up_block', 'login_block', 'full_block');

CREATE TABLE blocked_ips (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address      TEXT UNIQUE NOT NULL,                  -- IP address or CIDR range (e.g., "192.168.1.100", "10.0.0.0/8").

  -- sign_up_block = prevent new account creation from this IP.
  -- login_block = prevent login from this IP.
  -- full_block = block all access from this IP.
  severity        blocked_ip_severity NOT NULL DEFAULT 'full_block',

  reason          TEXT,                                  -- Why this IP was blocked.
  expires_at      TIMESTAMPTZ,                           -- When this block expires. Null = permanent.
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocked_ips_severity ON blocked_ips (severity);
CREATE INDEX idx_blocked_ips_expires_at ON blocked_ips (expires_at);
CREATE INDEX idx_blocked_ips_created_by ON blocked_ips (created_by);
