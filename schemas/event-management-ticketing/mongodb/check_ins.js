// check_ins: Records of ticket holders checking in at events or sessions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const checkInsSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventSession", default: null },
    checked_in_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    method: {
      type: String,
      enum: ["qr_scan", "manual", "self_service", "auto"],
      required: true,
      default: "qr_scan",
    },
    checked_in_at: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

checkInsSchema.index({ ticket_id: 1 });
checkInsSchema.index({ session_id: 1, checked_in_at: 1 });

module.exports = mongoose.model("CheckIn", checkInsSchema);
