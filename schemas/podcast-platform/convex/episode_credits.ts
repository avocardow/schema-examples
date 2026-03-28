// episode_credits: maps people to episodes with a specific role and group (cast/crew/etc.).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const episode_credits = defineTable({
  episodeId: v.id("episodes"),
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
  .index("by_episode_id_person_id_role", ["episodeId", "personId", "role"])
  .index("by_person_id", ["personId"]);
