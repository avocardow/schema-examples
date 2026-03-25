// tickets: Core support requests from customers with assignment and SLA tracking.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    description: { type: String, default: null },
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketStatus", required: true },
    priority_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketPriority", required: true },
    type: {
      type: String,
      enum: ["question", "incident", "problem", "feature_request"],
      required: true,
      default: "question",
    },
    source: {
      type: String,
      enum: ["email", "web", "phone", "api", "social"],
      required: true,
      default: "web",
    },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketCategory", default: null },
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assigned_agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assigned_team_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    sla_policy_id: { type: mongoose.Schema.Types.ObjectId, ref: "SlaPolicy", default: null },
    due_at: { type: Date, default: null },
    first_response_at: { type: Date, default: null },
    resolved_at: { type: Date, default: null },
    closed_at: { type: Date, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ticketsSchema.index({ status_id: 1 });
ticketsSchema.index({ priority_id: 1 });
ticketsSchema.index({ requester_id: 1 });
ticketsSchema.index({ assigned_agent_id: 1 });
ticketsSchema.index({ assigned_team_id: 1 });
ticketsSchema.index({ category_id: 1 });
ticketsSchema.index({ sla_policy_id: 1 });
ticketsSchema.index({ created_at: 1 });
ticketsSchema.index({ due_at: 1 });

module.exports = mongoose.model("Ticket", ticketsSchema);
