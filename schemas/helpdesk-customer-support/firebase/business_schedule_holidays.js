// business_schedule_holidays: date-based exceptions when a business schedule is inactive.
// See README.md for full design rationale.

/**
 * @typedef {Object} BusinessScheduleHolidayDocument
 * @property {string} id
 * @property {string} scheduleId - FK → business_schedules
 * @property {string} name
 * @property {string} date
 */

/**
 * @param {Omit<BusinessScheduleHolidayDocument, "id">} fields
 * @returns {Omit<BusinessScheduleHolidayDocument, "id">}
 */
export function createBusinessScheduleHoliday(fields) {
  return {
    scheduleId: fields.scheduleId,
    name: fields.name,
    date: fields.date,
  };
}

export const businessScheduleHolidayConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      scheduleId: data.scheduleId,
      name: data.name,
      date: data.date,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "business_schedule_holidays"
 *   - scheduleId ASC, date ASC (unique)
 */
