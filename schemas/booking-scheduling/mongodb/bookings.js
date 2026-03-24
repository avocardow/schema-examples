// bookings: Core booking records linking customers, providers, and time slots.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema(
  {
    provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location", default: null },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: null },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    timezone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "declined", "no_show"],
      required: true,
      default: "pending",
    },
    cancelled_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    cancellation_reason: { type: String, default: null },
    cancelled_at: { type: Date, default: null },
    customer_notes: { type: String, default: null },
    provider_notes: { type: String, default: null },
    source: {
      type: String,
      enum: ["online", "manual", "api", "import"],
      required: true,
      default: "online",
    },
    payment_status: {
      type: String,
      enum: ["not_required", "pending", "paid", "refunded", "partially_refunded"],
      required: true,
      default: "not_required",
    },
    recurrence_group_id: { type: String, default: null },
    recurrence_rule: { type: String, default: null },
    confirmed_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

bookingsSchema.index({ provider_id: 1, start_time: 1 });
bookingsSchema.index({ customer_id: 1, start_time: 1 });
bookingsSchema.index({ status: 1 });
bookingsSchema.index({ start_time: 1, end_time: 1 });
bookingsSchema.index({ location_id: 1 });
bookingsSchema.index({ recurrence_group_id: 1 });

module.exports = mongoose.model("Booking", bookingsSchema);
