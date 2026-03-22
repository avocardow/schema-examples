// notifications: Per-recipient notification record.
// One row per recipient per event. Tracks delivery status and engagement as separate concerns.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationEvent", required: true },

    // Polymorphic recipient — not a FK. Recipients can be any entity type.
    recipient_type: { type: String, required: true },
    recipient_id: { type: String, required: true },

    // Why this person was notified (e.g., "mention", "assign", "subscription").
    reason: { type: String },

    delivery_status: {
      type: String,
      enum: ["pending", "queued", "sent", "delivered", "failed", "canceled"],
      default: "pending",
      required: true,
    },

    // Engagement timestamps — nullable, can coexist.
    seen_at: { type: Date },
    read_at: { type: Date },
    interacted_at: { type: Date },
    archived_at: { type: Date },

    expires_at: { type: Date },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

notificationsSchema.index({ event_id: 1 });
notificationsSchema.index({ recipient_type: 1, recipient_id: 1, read_at: 1 });
notificationsSchema.index({ recipient_type: 1, recipient_id: 1, created_at: 1 });
notificationsSchema.index({ recipient_type: 1, recipient_id: 1, seen_at: 1 });
notificationsSchema.index({ delivery_status: 1 });
notificationsSchema.index({ expires_at: 1 });

module.exports = mongoose.model("Notification", notificationsSchema);
