// audit_logs: Immutable event log for security-relevant actions.
// Append-only — never update or delete rows.
// Uses polymorphic actor/target (not FKs) so logs survive entity deletion.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const auditLogsSchema = new mongoose.Schema(
  {
    // Structured event codes: resource.action.result
    // e.g., "user.login.success", "role.assigned", "session.impersonation.started"
    event_type: { type: String, required: true },

    // Polymorphic actor/target: NOT FKs. Audit logs must survive entity deletion.
    actor_type: { type: String, enum: ["user", "system", "api_key", "service"], required: true },
    actor_id: { type: String }, // user_id, api_key_id, or service name.
    target_type: { type: String }, // e.g., "user", "organization", "role".
    target_id: { type: String },

    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    ip_address: { type: String },
    user_agent: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }, // Event-specific details.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

auditLogsSchema.index({ event_type: 1 });
auditLogsSchema.index({ actor_type: 1, actor_id: 1 });
auditLogsSchema.index({ target_type: 1, target_id: 1 });
auditLogsSchema.index({ organization_id: 1, created_at: 1 });
auditLogsSchema.index({ created_at: 1 });

module.exports = mongoose.model("AuditLog", auditLogsSchema);
