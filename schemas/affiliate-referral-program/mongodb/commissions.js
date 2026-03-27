// commissions: Tracks commission earned by affiliates per conversion, with approval and payout lifecycle.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    conversion_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversion",
      required: true,
    },
    affiliate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "voided"],
      required: true,
      default: "pending",
    },
    commission_type: {
      type: String,
      enum: ["percentage", "flat", "hybrid"],
      required: true,
    },
    commission_rate: { type: Number, default: null },
    commission_flat: { type: Number, default: null },
    tier_level: { type: Number, required: true, default: 1 },
    approved_at: { type: Date, default: null },
    paid_at: { type: Date, default: null },
    voided_at: { type: Date, default: null },
    voided_reason: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

commissionSchema.index({ conversion_id: 1 });
commissionSchema.index({ affiliate_id: 1, status: 1 });
commissionSchema.index({ program_id: 1, status: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ created_at: 1 });

module.exports = mongoose.model("Commission", commissionSchema);
