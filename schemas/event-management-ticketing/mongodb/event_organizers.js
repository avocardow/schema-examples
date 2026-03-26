// event_organizers: Users assigned to manage or staff an event.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventOrganizersSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator", "check_in_staff"],
      required: true,
      default: "admin",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

eventOrganizersSchema.index({ event_id: 1, user_id: 1 }, { unique: true });
eventOrganizersSchema.index({ user_id: 1 });

module.exports = mongoose.model("EventOrganizer", eventOrganizersSchema);
