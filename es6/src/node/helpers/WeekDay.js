import Day from '../classes/Day'

class WeekDay {
  static get DAYS() {
    return {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6
    };
  }

  constructor(index) {
    if (!arguments.length) {
      throw new Error('Invalid index');
    };

    if (typeof index !== 'number') {
      throw new Error('Invalid index');
    };

    if (index > 6) {
      throw new Error('Invalid index');
    };

    return [
      new Day(0, 'Sunday', { weekend: true, lastInWeek: true }),
      new Day(1, 'Monday', { workday: true, firstInWeek: true }),
      new Day(2, 'Tuesday', { workday: true }),
      new Day(3, 'Wednesday', { workday: true }),
      new Day(4, 'Thursday', { workday: true }),
      new Day(5, 'Friday', { workday: true }),
      new Day(6, 'Saturday', { weekend: true })
    ][index];
  }
}

export default WeekDay;
