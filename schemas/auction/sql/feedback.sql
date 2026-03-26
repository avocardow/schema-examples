-- feedback: Buyer/seller ratings and comments after an auction concludes.
-- See README.md for full design rationale.

CREATE TYPE feedback_direction AS ENUM ('buyer_to_seller', 'seller_to_buyer');

CREATE TABLE feedback (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auction_winner_id UUID NOT NULL REFERENCES auction_winners(id) ON DELETE CASCADE,
    author_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    direction         feedback_direction NOT NULL,
    rating            INTEGER NOT NULL,
    comment           TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (auction_winner_id, direction)
);

CREATE INDEX idx_feedback_recipient_id ON feedback(recipient_id);
CREATE INDEX idx_feedback_author_id ON feedback(author_id);
