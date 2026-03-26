// dispute_messages: Threaded messages within a dispute conversation.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const disputeMessageSchema = new mongoose.Schema(
  {
    dispute_id: { type: mongoose.Schema.Types.ObjectId, ref: "Dispute", required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender_role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      required: true,
    },
    body: { type: String, required: true },
    attachments: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

disputeMessageSchema.index({ dispute_id: 1, created_at: 1 });

module.exports = mongoose.model("DisputeMessage", disputeMessageSchema);
