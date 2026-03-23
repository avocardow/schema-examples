// menus: Named navigation menus for header, footer, and sidebar placement.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const menusSchema = new mongoose.Schema(
  {
name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
menusSchema.index({ slug: 1 }, { unique: true });
module.exports = mongoose.model("Menu", menusSchema);
