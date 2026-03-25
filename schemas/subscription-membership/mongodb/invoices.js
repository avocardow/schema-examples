// invoices: Billing invoices for customers.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const invoicesSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null },
    status: {
      type: String,
      enum: ["draft", "open", "paid", "void", "uncollectible"],
      required: true,
      default: "draft",
    },
    currency: { type: String, required: true },
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    amount_paid: { type: Number, required: true, default: 0 },
    amount_due: { type: Number, required: true, default: 0 },
    period_start: { type: Date, default: null },
    period_end: { type: Date, default: null },
    due_date: { type: Date, default: null },
    paid_at: { type: Date, default: null },
    hosted_invoice_url: { type: String, default: null },
    invoice_pdf_url: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

invoicesSchema.index({ customer_id: 1 });
invoicesSchema.index({ subscription_id: 1 });
invoicesSchema.index({ status: 1 });
invoicesSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("Invoice", invoicesSchema);
