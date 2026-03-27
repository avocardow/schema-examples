-- loyalty_members: Enrollment of a user in a loyalty program with cached point balances.
-- See README.md for full design rationale.

CREATE TYPE loyalty_member_status AS ENUM ('active', 'suspended', 'banned');

CREATE TABLE loyalty_members (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id        UUID NOT NULL,
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_number     TEXT UNIQUE NOT NULL,
    status            loyalty_member_status NOT NULL DEFAULT 'active',
    points_balance    INTEGER NOT NULL DEFAULT 0,
    points_pending    INTEGER NOT NULL DEFAULT 0,
    lifetime_points   INTEGER NOT NULL DEFAULT 0,
    points_redeemed   INTEGER NOT NULL DEFAULT 0,
    points_expired    INTEGER NOT NULL DEFAULT 0,
    enrolled_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    suspended_at      TIMESTAMPTZ,
    metadata          JSONB DEFAULT '{}',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(program_id, user_id)
);

-- Forward FK: loyalty_programs is defined in loyalty_programs.sql (loaded after loyalty_members.sql).
ALTER TABLE loyalty_members ADD CONSTRAINT fk_loyalty_members_program_id
    FOREIGN KEY (program_id) REFERENCES loyalty_programs(id) ON DELETE CASCADE;

CREATE INDEX idx_loyalty_members_user_id ON loyalty_members(user_id);
CREATE INDEX idx_loyalty_members_status ON loyalty_members(status);
CREATE INDEX idx_loyalty_members_points_balance ON loyalty_members(points_balance);
