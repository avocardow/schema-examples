// vendor_members: Team members and roles within a vendor organization.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorMemberSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "editor", "viewer"],
      required: true,
      default: "viewer",
    },
    invited_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    joined_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

vendorMemberSchema.index({ vendor_id: 1, user_id: 1 }, { unique: true });
vendorMemberSchema.index({ user_id: 1 });

module.exports = mongoose.model("VendorMember", vendorMemberSchema);
