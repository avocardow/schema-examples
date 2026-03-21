// team_members: Links users to teams within an organization.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const teamMembersSchema = new mongoose.Schema(
  {
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String }, // Simple team role (e.g., "lead", "member"). Not a FK — intentionally lightweight.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

teamMembersSchema.index({ team_id: 1, user_id: 1 }, { unique: true });
teamMembersSchema.index({ team_id: 1 });
teamMembersSchema.index({ user_id: 1 });

module.exports = mongoose.model("TeamMember", teamMembersSchema);
