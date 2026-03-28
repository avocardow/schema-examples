// show_credits: cast and crew credits linking people to shows with roles.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const show_credits = defineTable({
  showId: v.id("shows"),
  personId: v.id("people"),
  role: v.union(
    v.literal("host"),
    v.literal("co_host"),
    v.literal("guest"),
    v.literal("producer"),
    v.literal("editor"),
    v.literal("sound_designer"),
    v.literal("composer"),
    v.literal("narrator"),
    v.literal("researcher"),
    v.literal("writer")
  ),
  group: v.union(
    v.literal("cast"),
    v.literal("crew"),
    v.literal("writing"),
    v.literal("audio_post_production"),
    v.literal("video_post_production")
  ),
  position: v.number(),
})
  .index("by_show_id_person_id_role", ["showId", "personId", "role"])
  .index("by_person_id", ["personId"]);
