// contact_companies: Join table linking contacts to companies with roles.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactCompaniesSchema = new mongoose.Schema(
  {
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    role: { type: String, default: null },
    is_primary: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

contactCompaniesSchema.index({ contact_id: 1, company_id: 1 }, { unique: true });
contactCompaniesSchema.index({ company_id: 1 });

module.exports = mongoose.model("ContactCompany", contactCompaniesSchema);
