// booking_services: Services and add-ons included in a booking with pricing snapshot.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookingServicesSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    addon_id: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceAddon", default: null },
    service_name: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, default: null },
    currency: { type: String, default: null },
    is_primary: { type: Boolean, required: true, default: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

bookingServicesSchema.index({ booking_id: 1 });
bookingServicesSchema.index({ service_id: 1 });

module.exports = mongoose.model("BookingService", bookingServicesSchema);
