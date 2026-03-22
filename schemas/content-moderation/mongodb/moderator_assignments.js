// moderator_assignments: Default routing of content to moderators.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderatorAssignmentsSchema = new mongoose.Schema(
  {
    moderator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The assigned moderator.
    scope: {
      type: String,
      enum: ["community", "channel", "category"],
      required: true,
    }, // What this assignment covers.
    scope_id: {
      type: String,
      required: true,
    }, // ID of the community, channel, or violation category.
    role: {
      type: String,
      enum: ["moderator", "senior_moderator", "admin"],
      required: true,
      default: "moderator",
    }, // Authority level within this assignment scope.
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    }, // Whether this assignment is currently active.
    assigned_at: {
      type: Date,
      required: true,
      default: Date.now,
    }, // When this assignment was created.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
moderatorAssignmentsSchema.index(
  { moderator_id: 1, scope: 1, scope_id: 1 },
  { unique: true }
); // One assignment per moderator per scope entity.
moderatorAssignmentsSchema.index({ scope: 1, scope_id: 1 }); // "All moderators for this community."
moderatorAssignmentsSchema.index({ is_active: 1 }); // "All active assignments."

module.exports = mongoose.model("ModeratorAssignment", moderatorAssignmentsSchema);
