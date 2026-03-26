// control_tests: Records of control testing and their results.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const controlTestSchema = new mongoose.Schema(
  {
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: "Control", required: true },
    tested_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    test_date: { type: Date, required: true },
    result: {
      type: String,
      enum: ["pass", "fail", "partial", "not_applicable"],
      required: true,
    },
    notes: { type: String, default: null },
    next_test_date: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

controlTestSchema.index({ control_id: 1 });
controlTestSchema.index({ tested_by: 1 });
controlTestSchema.index({ result: 1 });
controlTestSchema.index({ test_date: 1 });

module.exports = mongoose.model("ControlTest", controlTestSchema);
