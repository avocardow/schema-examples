// event_updates: Announcements and news posts published for an event.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventUpdatesSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    is_published: { type: Boolean, required: true, default: false },
    is_pinned: { type: Boolean, required: true, default: false },
    published_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eventUpdatesSchema.index({ event_id: 1, is_published: 1, published_at: 1 });
eventUpdatesSchema.index({ author_id: 1 });

module.exports = mongoose.model("EventUpdate", eventUpdatesSchema);
