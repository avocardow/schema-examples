// tasks: Action items assigned to users with priority and status tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    due_date: { type: String, default: null },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "completed", "cancelled"],
      required: true,
      default: "todo",
    },
    completed_at: { type: Date, default: null },
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", default: null },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tasksSchema.index({ owner_id: 1, status: 1 });
tasksSchema.index({ due_date: 1 });
tasksSchema.index({ contact_id: 1 });
tasksSchema.index({ deal_id: 1 });

module.exports = mongoose.model("Task", tasksSchema);
