// deals: Sales opportunities tracked through pipeline stages to close.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const dealsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pipeline_id: { type: mongoose.Schema.Types.ObjectId, ref: "Pipeline", required: true },
    stage_id: { type: mongoose.Schema.Types.ObjectId, ref: "PipelineStage", default: null },
    value: { type: Number, default: null },
    currency: { type: String, required: true, default: "USD" },
    expected_close_date: { type: String, default: null },
    closed_at: { type: Date, default: null },
    lost_reason: { type: String, default: null },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "medium",
    },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

dealsSchema.index({ pipeline_id: 1, stage_id: 1 });
dealsSchema.index({ owner_id: 1 });
dealsSchema.index({ company_id: 1 });
dealsSchema.index({ contact_id: 1 });
dealsSchema.index({ expected_close_date: 1 });
dealsSchema.index({ closed_at: 1 });

module.exports = mongoose.model("Deal", dealsSchema);
