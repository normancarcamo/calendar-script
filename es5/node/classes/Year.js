"use strict";

var Observer = require("./Observer.js");
var Month = require("./Month.js");
var WeekDay = require("../helpers/WeekDay.js");

var Year = function(key) {
  if (!(/(^19(7|8|9){1,1}\d{1,1}$|^2\d{3,3}$)/g.test(key))) {
    throw new Error("Invalid year argument");
  };

  Observer.call(this);

  this.months = [];
  this.key = key;
  this.leap = new Date(key, 2, 0).getDate() > 28;
  this.days = this.leap ? 366 : 365;
};

Year.prototype = Object.create(Observer.prototype);

Year.prototype.constructor = Observer;

Year.EVENTS = {
  EACH_MONTH: "each:month",
  EACH_MONTH_ADDED: "each:month:added"
};

Year.prototype.addMonth = function(month, type) {
  if (!month) {
    throw new Error("Invalid month argument");
  };

  if (month) {
    if (!month.name) {
      throw new Error("Invalid month.name argument");
    };
    if (!month.key) {
      throw new Error("Invalid month.key argument");
    };
  };

  if (type) {
    if (typeof type !== "string") {
      throw new Error("Invalid month-type event argument");
    } else {
      this.emit(type, month);
    };
  };

  this.months.push(month);
};

module.exports = Year;
