// keyword_list_entries: Individual words/phrases in keyword lists.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const keywordListEntriesSchema = new mongoose.Schema(
  {
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KeywordList",
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    match_type: {
      type: String,
      enum: ["exact", "contains", "regex"],
      required: true,
      default: "exact",
    },
    is_case_sensitive: {
      type: Boolean,
      required: true,
      default: false,
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
keywordListEntriesSchema.index(
  { list_id: 1, value: 1, match_type: 1 },
  { unique: true }
);
module.exports = mongoose.model("KeywordListEntry", keywordListEntriesSchema);
