// notification_categories: Classification of notification types for organizing user preferences and routing to feeds.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationCategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name (e.g., "Comments", "Billing", "Security Alerts").
    slug: { type: String, unique: true, required: true }, // Identifier used in code and API (e.g., "comments", "billing", "security").
    description: { type: String }, // Explain what triggers notifications in this category.
    color: { type: String }, // Hex color for UI display (e.g., "#3B82F6").
    icon: { type: String }, // Icon identifier or URL for UI display.

    // Critical/required notifications bypass user preferences entirely.
    // Users cannot opt out of required categories.
    is_required: { type: Boolean, required: true, default: false },

    // Default feed: where notifications of this category appear.
    // Null = no default feed (appears in all feeds).
    default_feed_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationFeed" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationCategoriesSchema.index({ is_required: 1 });

module.exports = mongoose.model("NotificationCategory", notificationCategoriesSchema);
