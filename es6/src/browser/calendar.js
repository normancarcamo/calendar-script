(function() {
  'use strict'

  var Calendar = (function() {
    // ----------------------------------------------------------------------------

    class Observer {
      constructor() {
        this.actions = {};
      }

      on(name, action) {
        if (!name) {
          throw new Error('Parameter "name" must be passed as a string');
        };

        if (!action) {
          throw new Error('Parameter "action" must be passed as a function');
        };

        if (!this.actions[name]) {
          this.actions[name] = { notify: action };
        } else {
          this.actions[name].notify = action;
        };

        return this;
      }

      off(name, callback) {
        if (!name) {
          throw new Error('Parameter "name" must be passed as a string');
        };

        if (this.actions[name]) {
          delete this.actions[name];
        };

        if (callback) {
          callback();
        };

        return this;
      }

      offAll(callback) {
        Object.keys(this.actions).forEach((name) => {
          if (this.actions[name]) {
            delete this.actions[name];
          };
        });

        if (callback) {
          callback();
        };

        return this;
      }

      emit(name, data) {
        if (!name) {
          throw new Error('Parameter "name" must be passed as a string');
        };

        if (this.actions[name]) {
          this.actions[name].notify.apply(this,
            Array.prototype.slice.call(arguments).slice(1)
          );
        };

        return this;
      }

      emitAll(callback) {
        Object.keys(this.actions).forEach((name) => {
          if (this.actions[name]) {
            this.actions[name].notify.call(this);
          };
        });

        if (callback) {
          callback();
        };

        return this;
      }
    }

    // ----------------------------------------------------------------------------

    class Day extends Observer {
      constructor(key, name, summary) {
        super();

        if (typeof key !== 'number') {
          throw new Error('Invalid "key" for Day');
        };

        if (!name || typeof name !== 'string') {
          throw new Error('Invalid "name" for Day');
        };

        if (summary) {
          this.summary = summary;
        };

        this.key = key;
        this.name = name ? name.toLowerCase() : '';
        this.letter = this.name.charAt(0);
        this.abbr = this.name.substring(0, 3);
      }
    }

    // ----------------------------------------------------------------------------

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

    // ----------------------------------------------------------------------------

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
        };

        return Object.keys(summary).reduce((target, key, index) => {
          let month = new Month((index + 1), key, summary[key]);

          if (leap) {
            if (index === 1) { // February
              month.summary.days++;
              month.summary.end++;
            } else if (index >= 2) { // march, april, may, ...
              month.summary.days++;
              month.summary.start++;
              month.summary.end++;
            };
          };

          target.push(month);

          return target;
        }, []);
      }
    }

    // ----------------------------------------------------------------------------

    class Month extends Observer {
      static get EVENTS() {
        return {
          EACH_DAY: 'each:day',
          EACH_DAY_ADDED: 'each:day:added'
        };
      }

      constructor(key, name, summary) {
        super();

        if (typeof key !== 'number') {
          throw new Error('Invalid "key" for Month');
        };

        if (!name || typeof name !== 'string') {
          throw new Error('Invalid "name" for Month');
        };

        if (summary) {
          this.summary = summary;
        };

        this.key = key;
        this.name = name ? name.toLowerCase() : '';
        this.letter = this.name.charAt(0);
        this.abbr = this.name.substring(0, 3);
        this.days = [];
      }

      addDay(day, action, callback) {
        if (!arguments.length) {
          throw new Error('Invalid arguments');
        };

        if (!(day instanceof Day)) {
          throw new Error('Invalid day');
        };

        if (action) {
          if (typeof action !== 'string') {
            throw new Error('Invalid action');
          } else {
            this.emit(action, day);
          };
        };

        this.days.push(day);

        if (callback) {
          if (typeof callback !== "function") {
            throw new Error('Invalid callback');
          } else {
            callback(this.days);
          };
        };

        return this;
      }
    }

    // ----------------------------------------------------------------------------

    class Year extends Observer {
      static get EVENTS() {
        return {
          EACH_MONTH: 'each:month',
          EACH_MONTH_ADDED: 'each:month:added'
        };
      }

      constructor(key) {
        super();

        if (!/(^19\d{1,2}$|^2\d{3,3}$)/g.test(key)) {
          throw new Error('Invalid "key" for Year');
        };

        this.months = [];
        this.key = key;
        this.leap = new Date(key, 2, 0).getDate() > 28;
        this.days = this.leap ? 366 : 365;
      }

      addMonth(month, action, callback) {
        if (!arguments.length) {
          throw new Error('Invalid arguments');
        };

        if (!(month instanceof Month)) {
          throw new Error('Invalid month');
        };

        if (action) {
          if (typeof action !== 'string') {
            throw new Error('Invalid action');
          } else {
            this.emit(action, month);
          };
        };

        this.months.push(month);

        if (callback) {
          if (typeof callback !== "function") {
            throw new Error('Invalid callback');
          } else {
            callback(this.months);
          };
        };

        return this;
      }
    }

    // ----------------------------------------------------------------------------

    class Calendar extends Observer {
      static get EVENTS() {
        return {
          EACH_YEAR: 'each:year',
          EACH_YEAR_ADDED: 'each:year:added'
        };
      }

      constructor() {
        super();
        this.today = new Date(Date.now());
        this.years = {};
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
          year.emit(Year.EVENTS.EACH_MONTH, month);

          const END_OF_MONTH = (new Date(year.key, index + 1, 0)).getDate();

          let daysInYear = month.summary.start;

          let daysInCollection = 0;

          while (daysInCollection < END_OF_MONTH) {
            const key = daysInCollection + 1;

            const date = new Date(year.key, index, key, 0, 0, 0, 0);

            const monthZero = (index + 1) < 10 ? `0${(index + 1)}` : (index + 1);

            const dayZero = (key < 10) ? `0${key}` : key;

            const day = new WeekDay(date.getDay());

            day.key = key;

            day.date = [date, `${year.key}-${monthZero}-${dayZero}`];

            day.summary.indexInWeek = date.getDay();

            day.summary.indexInYear = daysInYear;

            if (key === 1) {
              day.summary.firstInMonth = true;
            };

            if (key === END_OF_MONTH) {
              day.summary.lastInMonth = true;
            };

            month.emit(Month.EVENTS.EACH_DAY, day);

            month.addDay(day, Month.EVENTS.EACH_DAY_ADDED);

            daysInYear++;

            daysInCollection++;
          };

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
            target.push(days.slice(index, index + 7));
          };
          return target;
        }, []);
      }

      daysWithPadding(month) {
        if (!arguments.length) {
          throw new Error('Invalid arguments');
        };

        if (!(month instanceof Month)) {
          throw new Error('Invalid month');
        };

        const firstday = month.days[0];
        const lastday = month.days[month.days.length-1];
        const prevl = (firstday.summary.indexInWeek - 0);
        const nextl = (42 - lastday.key) - prevl;
        const year = firstday.date[0].getFullYear();
        const prev = [];
        const next = [];

        // PREV:
        for (let p = prevl; p--;) {
          const date = new Date(year, month.key - 1, p === 0 ? 0 : -p);

          const key = date.getDate();

          const monthZero = ((date.getMonth() + 1) < 10
            ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
          );

          const dayZero = (key < 10) ? `0${key}` : key;

          const day = new WeekDay(date.getDay());

          day.key = key;

          day.date = [date, `${date.getFullYear()}-${monthZero}-${dayZero}`];

          if (key === lastday.date[0].getDate()) {
            day.summary.lastInMonth = true;
          };

          day.summary.indexInWeek = date.getDay();

          day.summary.prev = true;

          day.summary.padding = true;

          prev.push(day);
        };

        // NEXT:
        for (let n = lastday.key + 1; n <= (lastday.key + nextl); n++) {
          const date = new Date(year, month.key - 1, n);

          const key = date.getDate();

          const monthZero = ((date.getMonth() + 1) < 10
            ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
          );

          const dayZero = key < 10 ? `0${key}` : key;

          const day = new WeekDay(date.getDay());

          day.key = key;

          day.date = [date, `${date.getFullYear()}-${monthZero}-${dayZero}`];

          if (key === 1) {
            day.summary.firstInMonth = true;
          };

          day.summary.indexInWeek = date.getDay();

          day.summary.next = true;

          day.summary.padding = true;

          next.push(day);
        }

        return {
          days: prev.concat(month.days).concat(next),
          prev: prevl,
          next: nextl
        };
      }
    }

    return Calendar
    // ----------------------------------------------------------------------------
  })();

  if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Calendar;
  } else {
    if (typeof define === "function" && define.amd) {
      define([], function() {
        return Calendar;
      });
    } else {
      window.Calendar = Calendar;
    };
  };
})();
