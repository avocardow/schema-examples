// notification_template_contents: Per-channel content variants for a notification template.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationTemplateContentsSchema = new mongoose.Schema(
  {
    template_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationTemplate", required: true },

    // Which channel this content is for.
    channel_type: {
      type: String,
      enum: ["email", "sms", "push", "in_app", "chat", "webhook"],
      required: true,
    },

    subject: { type: String }, // Email subject, push title. Not applicable for SMS or webhook.
    body: { type: String, required: true }, // HTML for email, plain text for SMS, structured for in-app.

    // Channel-specific metadata (provider-specific fields, layout options, etc.).
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationTemplateContentsSchema.index({ template_id: 1, channel_type: 1 }, { unique: true });
notificationTemplateContentsSchema.index({ template_id: 1 });

module.exports = mongoose.model("NotificationTemplateContent", notificationTemplateContentsSchema);
