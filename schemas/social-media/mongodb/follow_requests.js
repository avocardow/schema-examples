// follow_requests: Manages pending follow requests for private profiles.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const followRequestsSchema = new mongoose.Schema(
  {
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], required: true, default: "pending" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

followRequestsSchema.index({ requester_id: 1, target_id: 1 }, { unique: true });
followRequestsSchema.index({ target_id: 1, status: 1 });

module.exports = mongoose.model("FollowRequest", followRequestsSchema);
