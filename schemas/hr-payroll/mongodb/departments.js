// departments: Organizational units forming a hierarchy (self-referencing tree via parent_id).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const departmentsSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    name: { type: String, required: true },
    code: { type: String, default: null },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

departmentsSchema.index({ organization_id: 1 });
departmentsSchema.index({ parent_id: 1 });
departmentsSchema.index({ is_active: 1 });

module.exports = mongoose.model("Department", departmentsSchema);
