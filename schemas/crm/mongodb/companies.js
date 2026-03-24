// companies: Organizations and businesses tracked in the CRM.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const companiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: { type: String, unique: true, sparse: true, default: null },
    industry: { type: String, default: null },
    employee_count: { type: Number, default: null },
    annual_revenue: { type: Number, default: null },
    phone: { type: String, default: null },
    address_street: { type: String, default: null },
    address_city: { type: String, default: null },
    address_state: { type: String, default: null },
    address_country: { type: String, default: null },
    address_zip: { type: String, default: null },
    website: { type: String, default: null },
    description: { type: String, default: null },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

companiesSchema.index({ owner_id: 1 });
companiesSchema.index({ industry: 1 });

module.exports = mongoose.model("Company", companiesSchema);
