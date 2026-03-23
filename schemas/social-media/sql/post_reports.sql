-- post_reports: User-submitted reports of posts for moderation review.
-- See README.md for full design rationale and field documentation.

CREATE TYPE report_reason AS ENUM ('spam', 'harassment', 'hate_speech', 'violence', 'misinformation', 'nsfw', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

CREATE TABLE post_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL,
  reporter_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  reason      report_reason NOT NULL,
  description TEXT,
  status      report_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users (id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, reporter_id)
);

-- Forward FK: posts loads after post_reports alphabetically.
ALTER TABLE post_reports
  ADD CONSTRAINT fk_post_reports_post_id
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

CREATE INDEX idx_post_reports_status ON post_reports (status);
CREATE INDEX idx_post_reports_reporter_id ON post_reports (reporter_id);
CREATE INDEX idx_post_reports_reviewed_by ON post_reports (reviewed_by);
