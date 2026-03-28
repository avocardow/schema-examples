// ad_markers: timed advertising slots within a podcast episode (preroll, midroll, postroll).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ad_markers = defineTable({
  episodeId: v.id("episodes"),
  markerType: v.union(
    v.literal("preroll"),
    v.literal("midroll"),
    v.literal("postroll")
  ),
  positionMs: v.optional(v.number()),
  durationMs: v.optional(v.number()),
}).index("by_episode_id_and_marker_type", ["episodeId", "markerType"]);
