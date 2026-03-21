// permissions: Granular capabilities using "resource:action" naming (e.g., "posts:create").
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const permissionsSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true }, // Structured key: "resource:action" (e.g., "posts:create").
    name: { type: String, required: true }, // Display name (e.g., "Create Posts").
    description: { type: String },
    resource_type: { type: String }, // Groups permissions by resource (e.g., "posts", "users").
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

permissionsSchema.index({ resource_type: 1 });

module.exports = mongoose.model("Permission", permissionsSchema);
