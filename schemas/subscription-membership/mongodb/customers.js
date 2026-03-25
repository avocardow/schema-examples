// customers: Billing customer entity.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    organization_id: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    currency: { type: String, default: null },
    tax_id: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customersSchema.index({ user_id: 1 });
customersSchema.index({ organization_id: 1 });
customersSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("Customer", customersSchema);
