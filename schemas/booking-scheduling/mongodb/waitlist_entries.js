// waitlist_entries: Customers waiting for availability on specific dates and services.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const waitlistEntriesSchema = new mongoose.Schema(
  {
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", default: null },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location", default: null },
    preferred_date: { type: String, required: true },
    preferred_start: { type: String, default: null },
    preferred_end: { type: String, default: null },
    status: {
      type: String,
      enum: ["waiting", "notified", "booked", "expired", "cancelled"],
      required: true,
      default: "waiting",
    },
    notified_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

waitlistEntriesSchema.index({ service_id: 1, preferred_date: 1, status: 1 });
waitlistEntriesSchema.index({ customer_id: 1, status: 1 });
waitlistEntriesSchema.index({ status: 1, notified_at: 1 });

module.exports = mongoose.model("WaitlistEntry", waitlistEntriesSchema);
