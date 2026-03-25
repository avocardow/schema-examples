// sla_policy_targets: per-priority time targets within an SLA policy.
// See README.md for full design rationale.

/**
 * @typedef {Object} SlaPolicyTargetDocument
 * @property {string} id
 * @property {string} slaPolicyId - FK → sla_policies
 * @property {string} priorityId - FK → ticket_priorities
 * @property {number | null} firstResponseMinutes
 * @property {number | null} nextResponseMinutes
 * @property {number | null} resolutionMinutes
 */

/**
 * @param {Omit<SlaPolicyTargetDocument, "id">} fields
 * @returns {Omit<SlaPolicyTargetDocument, "id">}
 */
export function createSlaPolicyTarget(fields) {
  return {
    slaPolicyId: fields.slaPolicyId,
    priorityId: fields.priorityId,
    firstResponseMinutes: fields.firstResponseMinutes ?? null,
    nextResponseMinutes: fields.nextResponseMinutes ?? null,
    resolutionMinutes: fields.resolutionMinutes ?? null,
  };
}

export const slaPolicyTargetConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      slaPolicyId: data.slaPolicyId,
      priorityId: data.priorityId,
      firstResponseMinutes: data.firstResponseMinutes ?? null,
      nextResponseMinutes: data.nextResponseMinutes ?? null,
      resolutionMinutes: data.resolutionMinutes ?? null,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "sla_policy_targets"
 *   - slaPolicyId ASC, priorityId ASC (unique)
 */
