// notification_topics: Named pub/sub groups for fan-out delivery.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationTopicsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name (e.g., "Project Updates", "Marketing Newsletter").
    slug: { type: String, unique: true, required: true }, // Identifier used in code and API (e.g., "project_updates", "marketing").
    description: { type: String }, // Explain what subscribing to this topic means.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("NotificationTopic", notificationTopicsSchema);
