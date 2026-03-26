// event_sessions: Individual sessions or time slots within an event.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventSessionsSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    venue_id: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    track: { type: String, default: null },
    max_attendees: { type: Number, default: null },
    position: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "rescheduled"],
      required: true,
      default: "scheduled",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eventSessionsSchema.index({ event_id: 1, start_time: 1 });
eventSessionsSchema.index({ event_id: 1, track: 1 });
eventSessionsSchema.index({ status: 1 });

module.exports = mongoose.model("EventSession", eventSessionsSchema);
