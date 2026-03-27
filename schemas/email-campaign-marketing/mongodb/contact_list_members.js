// contact_list_members: Tracks contact membership and subscription status within lists.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const contactListMemberSchema = new mongoose.Schema(
  {
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactList",
      required: true,
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed", "unconfirmed"],
      required: true,
      default: "subscribed",
    },
    subscribed_at: {
      type: Date,
      default: null,
    },
    unsubscribed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

contactListMemberSchema.index({ contact_id: 1, list_id: 1 }, { unique: true });
contactListMemberSchema.index({ list_id: 1, status: 1 });

module.exports = mongoose.model("ContactListMember", contactListMemberSchema);
