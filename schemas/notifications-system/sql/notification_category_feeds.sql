-- notification_category_feeds: Many-to-many join between categories and feeds.
-- See README.md for full design rationale and field documentation.

CREATE TABLE notification_category_feeds (
  category_id     UUID NOT NULL REFERENCES notification_categories(id) ON DELETE CASCADE,
  feed_id         UUID NOT NULL REFERENCES notification_feeds(id) ON DELETE CASCADE,

  PRIMARY KEY (category_id, feed_id)
);

CREATE INDEX idx_notification_category_feeds_feed_id ON notification_category_feeds (feed_id);
