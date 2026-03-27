// transcript_segments: Individual spoken segments within a transcript with timing and speaker info.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const transcriptSegmentsSchema = new mongoose.Schema(
  {
    transcript_id: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript", required: true },
    speaker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    content: { type: String, required: true },
    speaker_name: { type: String, default: null },
    start_ms: { type: Number, required: true },
    end_ms: { type: Number, required: true },
    position: { type: Number, required: true },
    confidence: { type: Number, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

transcriptSegmentsSchema.index({ transcript_id: 1, position: 1 });
transcriptSegmentsSchema.index({ transcript_id: 1, start_ms: 1 });
transcriptSegmentsSchema.index({ speaker_id: 1 });

module.exports = mongoose.model("TranscriptSegment", transcriptSegmentsSchema);
