(function() {
  "use strict";

  var Calendar = (function() {
    // ----------------------------------------------------------------------------

    var Observer = function() {
      this.actions = {};
    };

    Observer.prototype.on = function(name, action) {
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
    };

    Observer.prototype.off = function(name, callback) {
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
    };

    Observer.prototype.offAll = function(callback) {
      Object.keys(this.actions).forEach(function(name) {
        if (this.actions[name]) {
          delete this.actions[name];
        };
      }, this);

      if (callback) {
        callback();
      };

      return this;
    }

    Observer.prototype.emit = function(name, data) {
      if (!name) {
        throw new Error('Parameter "name" must be passed as a string');
      };

      if (this.actions[name]) {
        this.actions[name].notify.apply(this,
          Array.prototype.slice.call(arguments).slice(1)
        );
      };

      return this;
    };

    Observer.prototype.emitAll = function() {
      Object.keys(this.actions).forEach(function(name) {
        if (this.actions[name]) {
          this.actions[name].notify.call(this);
        };
      }, this);

      if (callback) {
        callback();
      };

      return this;
    };

    // ----------------------------------------------------------------------------

    var Day = function(key, name, summary) {
      Observer.call(this);

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
    };

    Day.prototype = Object.create(Observer.prototype);
    Day.prototype.constructor = Observer;

    // ----------------------------------------------------------------------------

    var WeekDay = function(index) {
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
    };

    WeekDay.DAYS = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6
    };

    // ----------------------------------------------------------------------------

    var Month = function(key, name, summary) {
      Observer.call(this);

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
    };

    Month.prototype = Object.create(Observer.prototype);

    Month.prototype.constructor = Observer;

    Month.EVENTS = {
      EACH_DAY: 'each:day',
      EACH_DAY_ADDED: 'each:day:added'
    };

    Month.prototype.addDay = function(day, action, callback) {
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
    };

    // ----------------------------------------------------------------------------

    var Months = function(leap) {
      if (!arguments.length) {
        throw new Error('Invalid leap');
      };

      if (typeof leap !== 'boolean') {
        throw new Error('Invalid leap');
      };

      var summary = {
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

      return Object.keys(summary).reduce(function(target, key, index) {
        var month = new Month((index + 1), key, summary[key]);

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
    };

    // ----------------------------------------------------------------------------

    var Year = function(key) {
      Observer.call(this);

      if (!/(^19\d{1,2}$|^2\d{3,3}$)/g.test(key)) {
        throw new Error('Invalid "key" for Year');
      };

      this.months = [];
      this.key = key;
      this.leap = new Date(key, 2, 0).getDate() > 28;
      this.days = this.leap ? 366 : 365;
    };

    Year.prototype = Object.create(Observer.prototype);

    Year.prototype.constructor = Observer;

    Year.EVENTS = {
      EACH_MONTH: 'each:month',
      EACH_MONTH_ADDED: 'each:month:added'
    };

    Year.prototype.addMonth = function(month, action, callback) {
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
        }
      };

      return this;
    };

    // ----------------------------------------------------------------------------

    var Calendar = function() {
      Observer.call(this);
      this.today = new Date(Date.now())
      this.years = {}
    };

    Calendar.prototype = Object.create(Observer.prototype);

    Calendar.prototype.constructor = Observer;

    Calendar.EVENTS = {
      EACH_YEAR: 'each:year',
      EACH_YEAR_ADDED: 'each:year:added'
    };

    Calendar.prototype.addYear = function(year, callback) {
      if (!arguments.length) {
        throw new Error('Invalid arguments');
      };

      if (typeof year !== 'number' || !/(^19\d{1,2}$|^2\d{3,3}$)/g.test(year)) {
        throw new Error('Invalid year');
      };

      this.years[year] = new Year(year);

      this.emit(Calendar.EVENTS.EACH_YEAR, this.years[year]);

      var result = this.build(this.years[year]);

      this.emit(Calendar.EVENTS.EACH_YEAR_ADDED, this.years[year]);

      if (callback) {
        if (typeof callback !== "function") {
          throw new Error('Invalid callback');
        } else {
          callback(this.years);
        };
      };

      return this;
    };

    Calendar.prototype.build = function(year, callback) {
      if (!(year instanceof Year)) {
        throw new Error('Invalid year');
      };

      year.months = new Months(year.leap).map(function(month, index) {
        year.emit(Year.EVENTS.EACH_MONTH, month);

        var END_OF_MONTH = (new Date(year.key, index + 1, 0)).getDate();

        var daysInYear = month.summary.start;

        var daysInCollection = 0;

        while (daysInCollection < END_OF_MONTH) {
          var key = daysInCollection + 1;

          var date = new Date(year.key, index, key, 0, 0, 0, 0);

          var monthZero = (index + 1) < 10 ? `0${(index + 1)}` : (index + 1);

          var dayZero = (key < 10) ? `0${key}` : key;

          var day = new WeekDay(date.getDay());

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

        year.addMonth(month, Year.EVENTS.EACH_MONTH_ADDED);

        return month;
      }, this);

      if (callback) {
        if (typeof callback !== "function") {
          throw new Error('Invalid callback');
        } else {
          callback(year);
        };
      };

      return year;
    };

    Calendar.prototype.filter = function(options, callback) {
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

        var year = options.year || this.today.getFullYear();

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
    };

    Calendar.prototype.filterDaysPerWeek = function(days) {
      if (!arguments.length) {
        throw new Error('Invalid arguments');
      };

      if (Object.prototype.toString.call(days) !== '[object Array]') {
        throw new Error('Invalid days');
      };

      if (!days.length) {
        throw new Error('Invalid days');
      };

      return days.reduce(function(target, day, index) {
        if ((index % 7) === 0) {
          target.push(days.slice(index, index + 7))
        }
        return target
      }, []);
    };

    Calendar.prototype.daysWithPadding = function(month) {
      if (!arguments.length) {
        throw new Error('Invalid arguments');
      };

      if (!(month instanceof Month)) {
        throw new Error('Invalid month');
      };

      var firstday = month.days[0];
      var lastday = month.days[month.days.length-1];
      var prevl = (firstday.summary.indexInWeek - 0);
      var nextl = (42 - lastday.key) - prevl;
      var year = firstday.date[0].getFullYear();
      var prev = [];
      var next = [];

      // PREV:
      for (var p = prevl; p--;) {
        var date = new Date(year, month.key - 1, p === 0 ? 0 : -p);

        var key = date.getDate();

        var monthZero = ((date.getMonth() + 1) < 10
          ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
        );

        var dayZero = (key < 10) ? `0${key}` : key;

        var day = new WeekDay(date.getDay());

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
      for (var n = lastday.key + 1; n <= (lastday.key + nextl); n++) {
        var date = new Date(year, month.key - 1, n);

        var key = date.getDate();

        var monthZero = ((date.getMonth() + 1) < 10
          ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)
        );

        var dayZero = key < 10 ? `0${key}` : key;

        var day = new WeekDay(date.getDay());

        day.key = key;

        day.date = [date, `${date.getFullYear()}-${monthZero}-${dayZero}`];

        if (key === 1) {
          day.summary.firstInMonth = true;
        };

        day.summary.indexInWeek = date.getDay();

        day.summary.next = true;

        day.summary.padding = true;

        next.push(day);
      };

      return {
        days: prev.concat(month.days).concat(next),
        prev: prevl,
        next: nextl
      };
    };

    return Calendar;
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
