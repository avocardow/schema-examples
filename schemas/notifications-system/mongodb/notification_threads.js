// notification_threads: Thread-level state for grouping related notifications. Provides per-thread read tracking, thread-level metadata, and efficient "threads with unread" queries.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationThreadsSchema = new mongoose.Schema(
  {
    thread_key: { type: String, unique: true, required: true }, // e.g., "issue:456", "pr:789". Must match the thread_key on events.

    title: { type: String }, // e.g., "Fix login bug (#456)". Can be updated as the thread evolves.
    icon: { type: String }, // Icon URL or icon identifier for the thread.
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationCategory" }, // Optional: associate the thread with a category for filtering.

    notification_count: { type: Number, required: true, default: 0 }, // Counter cache. Updated by your app when notifications are created.

    last_activity_at: { type: Date }, // When the most recent event in this thread occurred. For sorting threads.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationThreadsSchema.index({ category_id: 1 });
notificationThreadsSchema.index({ last_activity_at: 1 });

module.exports = mongoose.model("NotificationThread", notificationThreadsSchema);
