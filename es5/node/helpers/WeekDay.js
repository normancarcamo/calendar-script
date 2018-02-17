"use strict";

var Day = require("../classes/Day.js");

var WeekDay = function(index) {
  return [
    new Day(0, "Sunday", { weekend: true, lastInWeek: true }),
    new Day(1, "Monday", { workday: true, firstInWeek: true }),
    new Day(2, "Tuesday", { workday: true }),
    new Day(3, "Wednesday", { workday: true }),
    new Day(4, "Thursday", { workday: true }),
    new Day(5, "Friday", { workday: true }),
    new Day(6, "Saturday", { weekend: true })
  ][index];
};

WeekDay.SUNDAY = 0;
WeekDay.MONDAY = 1;
WeekDay.TUESDAY = 2;
WeekDay.WEDNESDAY = 3;
WeekDay.THURSDAY = 4;
WeekDay.FRIDAY = 5;
WeekDay.SATURDAY = 6;

module.exports = WeekDay;
