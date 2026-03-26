// employee_documents: Documents and files associated with employees (contracts, tax forms, certifications, etc.).
// See README.md for full design rationale.

const mongoose = require("mongoose");

const employeeDocumentsSchema = new mongoose.Schema(
  {
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    type: { type: String, enum: ["contract", "tax_form", "identification", "certification", "offer_letter", "performance_review", "other"], required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    issued_date: { type: String, default: null },
    expiry_date: { type: String, default: null },
    status: { type: String, enum: ["active", "expired", "superseded", "archived"], required: true, default: "active" },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

employeeDocumentsSchema.index({ employee_id: 1 });
employeeDocumentsSchema.index({ file_id: 1 });
employeeDocumentsSchema.index({ type: 1 });
employeeDocumentsSchema.index({ expiry_date: 1 });
employeeDocumentsSchema.index({ status: 1 });

module.exports = mongoose.model("EmployeeDocument", employeeDocumentsSchema);
