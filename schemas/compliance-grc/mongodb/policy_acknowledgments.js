// policy_acknowledgments: Records of users acknowledging policy versions.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const policyAcknowledgmentSchema = new mongoose.Schema(
  {
    policy_version_id: { type: mongoose.Schema.Types.ObjectId, ref: "PolicyVersion", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    acknowledged_at: { type: Date, required: true },
    method: {
      type: String,
      enum: ["click_through", "electronic_signature", "manual"],
      required: true,
      default: "click_through",
    },
    ip_address: { type: String, default: null },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

policyAcknowledgmentSchema.index({ policy_version_id: 1, user_id: 1 }, { unique: true });
policyAcknowledgmentSchema.index({ user_id: 1 });
policyAcknowledgmentSchema.index({ acknowledged_at: 1 });

module.exports = mongoose.model("PolicyAcknowledgment", policyAcknowledgmentSchema);
