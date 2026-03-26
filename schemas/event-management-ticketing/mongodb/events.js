// events: Core event records with scheduling, visibility, and registration details.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
  {
    series_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventSeries", default: null },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventCategory", default: null },
    venue_id: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", default: null },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, default: null },
    description: { type: String, default: null },
    cover_image_url: { type: String, default: null },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    timezone: { type: String, required: true },
    is_all_day: { type: Boolean, required: true, default: false },
    max_attendees: { type: Number, default: null },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "postponed", "completed"],
      required: true,
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      required: true,
      default: "public",
    },
    registration_open_at: { type: Date, default: null },
    registration_close_at: { type: Date, default: null },
    is_free: { type: Boolean, required: true, default: false },
    contact_email: { type: String, default: null },
    website_url: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eventsSchema.index({ series_id: 1 });
eventsSchema.index({ category_id: 1 });
eventsSchema.index({ venue_id: 1 });
eventsSchema.index({ status: 1, start_time: 1 });
eventsSchema.index({ visibility: 1 });
eventsSchema.index({ start_time: 1, end_time: 1 });
eventsSchema.index({ created_by: 1 });

module.exports = mongoose.model("Event", eventsSchema);
