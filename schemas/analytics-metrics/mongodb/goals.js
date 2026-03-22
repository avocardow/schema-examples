// goals: Conversion goals defined by event type, URL pattern, or custom criteria.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const goalsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    goal_type: { type: String, enum: ["event", "page_view", "custom"], required: true },
    event_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventType", default: null },
    url_pattern: { type: String, default: null },
    value: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

goalsSchema.index({ goal_type: 1 });
goalsSchema.index({ event_type_id: 1 });
goalsSchema.index({ is_active: 1 });
goalsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Goal", goalsSchema);
