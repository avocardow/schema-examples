// booking_custom_field_answers: Customer responses to custom intake form fields.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const bookingCustomFieldAnswersSchema = new mongoose.Schema(
  {
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    custom_field_id: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", required: true },
    value: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

bookingCustomFieldAnswersSchema.index({ booking_id: 1, custom_field_id: 1 }, { unique: true });
bookingCustomFieldAnswersSchema.index({ custom_field_id: 1 });

module.exports = mongoose.model("BookingCustomFieldAnswer", bookingCustomFieldAnswersSchema);
