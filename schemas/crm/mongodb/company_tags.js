// company_tags: Join table linking companies to tags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const companyTagsSchema = new mongoose.Schema(
  {
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

companyTagsSchema.index({ company_id: 1, tag_id: 1 }, { unique: true });
companyTagsSchema.index({ tag_id: 1 });

module.exports = mongoose.model("CompanyTag", companyTagsSchema);
