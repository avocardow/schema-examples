// business_schedule_entries: individual day-of-week time slots within a business schedule.
// See README.md for full design rationale.

/**
 * @typedef {Object} BusinessScheduleEntryDocument
 * @property {string} id
 * @property {string} scheduleId - FK → business_schedules
 * @property {number} dayOfWeek
 * @property {string} startTime
 * @property {string} endTime
 */

/**
 * @param {Omit<BusinessScheduleEntryDocument, "id">} fields
 * @returns {Omit<BusinessScheduleEntryDocument, "id">}
 */
export function createBusinessScheduleEntry(fields) {
  return {
    scheduleId: fields.scheduleId,
    dayOfWeek: fields.dayOfWeek,
    startTime: fields.startTime,
    endTime: fields.endTime,
  };
}

export const businessScheduleEntryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      scheduleId: data.scheduleId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "business_schedule_entries"
 *   - scheduleId ASC, dayOfWeek ASC
 */
