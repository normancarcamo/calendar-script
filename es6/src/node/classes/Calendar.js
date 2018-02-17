import Observer from './Observer'
import Year from './Year'
import Month from './Month'
import Months from '../helpers/Months'
import WeekDay from '../helpers/WeekDay'

class Calendar extends Observer {
  static get EVENTS() {
    return {
      EACH_YEAR: 'each:year',
      EACH_YEAR_ADDED: 'each:year:added'
    }
  }

  constructor() {
    super()
    this.today = new Date(Date.now())
    this.years = {}
  }

  addYear(year, callback) {
    if (!arguments.length) {
      throw new Error('Invalid arguments');
    };

    if (typeof year !== 'number' || !/(^19\d{1,2}$|^2\d{3,3}$)/g.test(year)) {
      throw new Error('Invalid year');
    };

    this.years[year] = new Year(year);

    this.emit(Calendar.EVENTS.EACH_YEAR, this.years[year]);

    let result = this.build(this.years[year]);

    this.emit(Calendar.EVENTS.EACH_YEAR_ADDED, this.years[year]);

    if (callback) {
      if (typeof callback !== "function") {
        throw new Error('Invalid callback');
      } else {
        callback(this.years);
      };
    };

    return this;
  }

  build(year, callback) {
    if (!(year instanceof Year)) {
      throw new Error('Invalid year');
    };

    year.months = new Months(year.leap).map((month, index) => {
      year.emit(Year.EVENTS.EACH_MONTH, month)

      const END_OF_MONTH = (new Date(year.key, index + 1, 0)).getDate()

      let daysInYear = month.summary.start

      let daysInCollection = 0

      while (daysInCollection < END_OF_MONTH) {
        const key = daysInCollection + 1

        const date = new Date(year.key, index, key, 0, 0, 0, 0)

        const monthZero = (index + 1) < 10 ? `0${(index + 1)}` : (index + 1)

        const dayZero = (key < 10) ? `0${key}` : key

        const day = new WeekDay(date.getDay())

        day.key = key

        day.date = [date, `${year.key}-${monthZero}-${dayZero}`]

        day.summary.indexInWeek = date.getDay()

        day.summary.indexInYear = daysInYear

        if (key === 1) {
          day.summary.firstInMonth = true
        }

        if (key === END_OF_MONTH) {
          day.summary.lastInMonth = true
        }

        month.emit(Month.EVENTS.EACH_DAY, day)

        month.addDay(day, Month.EVENTS.EACH_DAY_ADDED)

        daysInYear++

        daysInCollection++
      }

      year.addMonth(month, Year.EVENTS.EACH_MONTH_ADDED)

      return month
    })

    if (callback) {
      if (typeof callback !== "function") {
        throw new Error('Invalid callback');
      } else {
        callback(year);
      };
    };

    return year;
  }

  filter(options, callback) {
    if (!options || typeof options !== 'object') {
      throw new Error('Invalid options');
    };

    if (!Object.keys(options).length) {
      throw new Error('Invalid options');
    };

    if (!('year' in options) && !('from' in options)) {
      throw new Error('Invalid options');
    };

    if ('year' in options) {
      if (typeof options.year !== 'number') {
        throw new Error('Invalid year');
      };

      if (!/(^19\d{1,2}$|^2\d{3,3}$)/g.test(options.year)) {
        throw new Error('Invalid year');
      };

      let year = options.year || this.today.getFullYear();

      this.addYear(year);
    } else {
      if ('from' in options) {
        if (typeof options.from !== 'number') {
          throw new Error('Invalid from');
        };

        if (!/(^19\d{1,2}$|^2\d{3,3}$)/g.test(options.from)) {
          throw new Error('Invalid from');
        };

        this.range = {
          from: options.from || 1900,
          to: options.to || this.today.getFullYear()
        };

        for (var year = this.range.from; year <= this.range.to; year++) {
          this.addYear(year);
        };
      };
    };


    if (callback) {
      if (typeof callback !== "function") {
        throw new Error('Invalid callback');
      } else {
        callback(year);
      };
    };

    return this;
  }

  filterDaysPerWeek(days) {
    if (!arguments.length) {
      throw new Error('Invalid arguments');
    };

    if (Object.prototype.toString.call(days) !== '[object Array]') {
      throw new Error('Invalid days');
    };

    if (!days.length) {
      throw new Error('Invalid days');
    };

    return days.reduce((target, day, index) => {
      if ((index % 7) === 0) {
        target.push(days.slice(index, index + 7))
      }
      return target
    }, []);
  }

  daysWithPadding(month) {
    if (!arguments.length) {
      throw new Error('Invalid arguments');
    };

    if (!(month instanceof Month)) {
      throw new Error('Invalid month');
    };

    const firstday = month.days[0]
    const lastday = month.days[month.days.length-1]
    const prevl = (firstday.summary.indexInWeek - 0)
    const nextl = (42 - lastday.key) - prevl
    const year = firstday.date[0].getFullYear()
    const prev = []
    const next = []

    // PREV:
    for (let p = prevl; p--;) {
      const date = new Date(year, month.key - 1, p === 0 ? 0 : -p)

      const key = date.getDate()

      const monthZero = ((date.getMonth() + 1) < 10
        ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
      )

      const dayZero = (key < 10) ? `0${key}` : key

      const day = new WeekDay(date.getDay())

      day.key = key

      day.date = [date, `${date.getFullYear()}-${monthZero}-${dayZero}`]

      if (key === lastday.date[0].getDate()) {
        day.summary.lastInMonth = true
      }

      day.summary.indexInWeek = date.getDay()

      day.summary.prev = true

      day.summary.padding = true

      prev.push(day)
    }

    // NEXT:
    for (let n = lastday.key + 1; n <= (lastday.key + nextl); n++) {
      const date = new Date(year, month.key - 1, n)

      const key = date.getDate()

      const monthZero = ((date.getMonth() + 1) < 10
        ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
      )

      const dayZero = key < 10 ? `0${key}` : key

      const day = new WeekDay(date.getDay())

      day.key = key

      day.date = [date, `${date.getFullYear()}-${monthZero}-${dayZero}`]

      if (key === 1) {
        day.summary.firstInMonth = true
      }

      day.summary.indexInWeek = date.getDay()

      day.summary.next = true

      day.summary.padding = true

      next.push(day)
    }

    return {
      days: prev.concat(month.days).concat(next),
      prev: prevl,
      next: nextl
    };
  }
}

export default Calendar;
