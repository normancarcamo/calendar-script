import Month from '../classes/Month';

class Months {
  constructor(leap) {
    if (!arguments.length) {
      throw new Error('Invalid leap');
    };

    if (typeof leap !== 'boolean') {
      throw new Error('Invalid leap');
    };

    let summary = {
      January: { days: 31, start: 1, end: 31 },
      February: { days: 28, start: 32, end: ( 31 + 28 ) },
      March: { days: 31, start: 60, end: ( 59 + 31 ) },
      April: { days: 30, start: 91, end: ( 90 + 30 ) },
      May: { days: 31, start: 121, end: ( 120 + 31 ) },
      June: { days: 30, start: 152, end: ( 151 + 30 ) },
      July: { days: 31, start: 182, end: ( 181 + 31 ) },
      August: { days: 31, start: 213, end: ( 212 + 31 ) },
      September: { days: 30, start: 244, end: ( 243 + 30 ) },
      October: { days: 31, start: 274, end: ( 273 + 31 ) },
      November: { days: 30, start: 305, end: ( 304 + 30 ) },
      December: { days: 31, start: 335, end: ( 334 + 31 ) }
    }

    return Object.keys(summary).reduce((target, key, index) => {
      let month = new Month((index + 1), key, summary[key])

      if (leap) {
        if (index === 1) { // February
          month.summary.days++
          month.summary.end++
        } else if (index >= 2) { // march, april, may, ...
          month.summary.days++
          month.summary.start++
          month.summary.end++
        }
      }

      target.push(month)

      return target
    }, [])
  }
}

export default Months
