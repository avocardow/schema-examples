// notification_category_feeds: Many-to-many join between categories and feeds.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationCategoryFeedsSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory", required: true },
  feed_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationFeed", required: true },
});

notificationCategoryFeedsSchema.index({ category_id: 1, feed_id: 1 }, { unique: true });
notificationCategoryFeedsSchema.index({ feed_id: 1 });

module.exports = mongoose.model("NotificationCategoryFeed", notificationCategoryFeedsSchema);
