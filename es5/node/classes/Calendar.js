"use strict";

var Observer = require("./Observer.js");
var Year = require("./Year.js");
var Month = require("./Month.js");
var WeekDay = require("../helpers/WeekDay.js");

var Calendar = function() {
  Observer.call(this);
  this.today = new Date(Date.now());
  this.years = {};
};

Calendar.prototype = Object.create(Observer.prototype);

Calendar.prototype.constructor = Observer;

Calendar.EVENTS = {
  EACH_YEAR: "each:year",
  EACH_YEAR_ADDED: "each:year:added"
};

Calendar.prototype.filter = function(options) {
  if (!options) {
    throw 'Options needed!';
  };

  if (options.year) {
    var year = options.year || this.today.getFullYear();
    this.addYear(year);
  } else {
    this.range = {
      from: options.from || 1970,
      to: options.to || this.today.getFullYear()
    };
    for (var year = this.range.from; year <= this.range.to; year++) {
      this.addYear(year);
    };
  };
};

Calendar.prototype.addYear = function(year) {
  this.years[year] = new Year(year);

  this.emit(Calendar.EVENTS.EACH_YEAR, this.years[year]);

  let result = this.build(this.years[year]);

  this.emit(Calendar.EVENTS.EACH_YEAR_ADDED, result);
};

Calendar.prototype.build = function(year) {
  year.months = new this.Months(year.leap).map(function(month, index) {

    year.emit(Year.EVENTS.EACH_MONTH, month);

    var END_OF_MONTH = (new Date(year.key, index + 1, 0)).getDate();

    var daysInYear = month.summary.start;

    var daysInCollection = 0;

    while (daysInCollection < END_OF_MONTH) {

      var key = daysInCollection + 1;

      var date = new Date(year.key, index, key, 0, 0, 0, 0);

      var monthZero = ((index + 1 < 10) ? "0" + (index + 1) : (index + 1));

      var dayZero = (key < 10) ? "0" + key : key;

      var day = new WeekDay(date.getDay());

      day.key = key;

      day.date = [date, year.key + "-" + monthZero + "-" + dayZero];

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

  }, year);

  return year;
};

Calendar.prototype.Months = function(leap) {
  if (typeof leap !== "boolean") {
    throw new Error("Invalid leap year argument");
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
      }
    }
    target.push(month);
    return target;
  }, []);
};

Calendar.prototype.filterDaysPerWeek = function(days) {
  return days.reduce(function(target, day, index) {
    if ((index % 7) === 0) {
      target.push(days.slice(index, index+7));
    }
    return target;
  }, []);
};

Calendar.prototype.daysWithPadding = function(month) {
  var firstday = month.days[0];
  var lastday = month.days[month.days.length-1];
  var prev = [];
  var next = [];

  // PREV:
  var prevl = (firstday.summary.indexInWeek - 0);
  var i = prevl

  var year = firstday.date[0].getFullYear();

  for (; i--;) {
    var date = new Date(year, month.key - 1, i === 0 ? 0 : -i);

    var key = date.getDate();

    var monthZero = (
      (date.getMonth() + 1) < 10
        ? "0" + (date.getMonth() + 1)
        : (date.getMonth() + 1)
    );

    var dayZero = (key < 10) ? ("0" + key) : key;

    var day = new WeekDay(date.getDay());

    day.key = key;

    day.date = [date, date.getFullYear() + "-" + monthZero + "-" + dayZero];

    if (key === lastday.date[0].getDate()) {
      day.summary.lastInMonth = true;
    };

    day.summary.indexInWeek = date.getDay();

    day.summary.prev = true;

    day.summary.padding = true;

    prev.push(day);
  };

  // NEXT:
  var nextl = (42 - lastday.key) - prevl;
  var i = lastday.key+1;

  for (; i <= (lastday.key + nextl); i++) {
    var date = new Date(year, month.key - 1, i);

    var key = date.getDate();

    var monthZero = (
      (date.getMonth() + 1) < 10
        ? "0" + (date.getMonth() + 1)
        : (date.getMonth() + 1)
    );

    var dayZero = (key < 10) ? ("0" + key) : key;

    var day = new WeekDay(date.getDay());

    day.key = key;

    day.date = [date, date.getFullYear() + "-" + monthZero + "-" + dayZero];

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
  }
};

module.exports = Calendar;
