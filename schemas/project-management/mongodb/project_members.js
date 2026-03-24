// project_members: Maps users to projects with role-based access control.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const projectMembersSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      required: true,
      default: "member",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

projectMembersSchema.index({ project_id: 1, user_id: 1 }, { unique: true });
projectMembersSchema.index({ user_id: 1 });

module.exports = mongoose.model("ProjectMember", projectMembersSchema);
