// contact_lists: Named lists for grouping contacts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

contactListSchema.index({ created_by: 1 });

module.exports = mongoose.model("ContactList", contactListSchema);
