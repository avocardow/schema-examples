-- reports: User-submitted content reports (flags) linking reported content to moderation queue items.
-- See README.md for full design rationale.

CREATE TYPE report_content_type AS ENUM ('post', 'comment', 'message', 'user', 'media');
CREATE TYPE report_category AS ENUM ('spam', 'harassment', 'hate_speech', 'violence', 'sexual_content', 'illegal', 'misinformation', 'self_harm', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'dismissed');

CREATE TABLE reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                                       -- Who submitted this report.
                                                       -- Cascade: if reporter is deleted, their reports are removed.
  content_type      report_content_type NOT NULL,       -- What type of content is being reported.
  content_id        TEXT NOT NULL,                      -- ID of the reported content. Text for external ID support.
  queue_item_id     UUID REFERENCES moderation_queue_items(id) ON DELETE SET NULL,
                                                       -- The queue item this report is linked to.
                                                       -- Multiple reports can reference the same queue item.
                                                       -- Set null: if queue item is deleted, report preserves history.
  category          report_category NOT NULL,           -- Reporter-selected reason category.
  reason_text       TEXT,                               -- Free-text explanation from the reporter.
  policy_id         UUID REFERENCES moderation_policies(id) ON DELETE SET NULL,
                                                       -- Which specific policy the reporter believes was violated.
                                                       -- Set null: if policy is deleted, report preserves history.
  status            report_status NOT NULL DEFAULT 'pending',
                                                       -- pending = not yet reviewed.
                                                       -- reviewed = moderator reviewed and took action.
                                                       -- dismissed = moderator reviewed and found no violation.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_queue_item_id ON reports(queue_item_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_content ON reports(content_type, content_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_created_at ON reports(created_at);
