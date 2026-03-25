// payment_methods: Payment instruments linked to a customer.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const paymentMethodsSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    type: {
      type: String,
      enum: ["card", "bank_account", "paypal", "sepa_debit", "ideal", "other"],
      required: true,
    },
    card_brand: { type: String, default: null },
    card_last4: { type: String, default: null },
    card_exp_month: { type: Number, default: null },
    card_exp_year: { type: Number, default: null },
    is_default: { type: Boolean, required: true, default: false },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

paymentMethodsSchema.index({ customer_id: 1 });
paymentMethodsSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("PaymentMethod", paymentMethodsSchema);
