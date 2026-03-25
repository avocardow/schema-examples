// invoice_items: Line items on an invoice.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const invoiceItemsSchema = new mongoose.Schema(
  {
    invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    plan_price_id: { type: mongoose.Schema.Types.ObjectId, ref: "PlanPrice", default: null },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    is_proration: { type: Boolean, required: true, default: false },
    period_start: { type: Date, default: null },
    period_end: { type: Date, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

invoiceItemsSchema.index({ invoice_id: 1 });
invoiceItemsSchema.index({ plan_price_id: 1 });

module.exports = mongoose.model("InvoiceItem", invoiceItemsSchema);
