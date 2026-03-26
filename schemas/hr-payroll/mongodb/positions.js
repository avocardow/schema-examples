// positions: Job positions within departments, each with a level and pay grade.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const positionsSchema = new mongoose.Schema(
  {
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    title: { type: String, required: true },
    code: { type: String, default: null },
    description: { type: String, default: null },
    level: { type: Number, default: null },
    pay_grade: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

positionsSchema.index({ department_id: 1 });
positionsSchema.index({ is_active: 1 });

module.exports = mongoose.model("Position", positionsSchema);
