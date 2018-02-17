"use strict";

var Observer = require("./Observer.js");

var Month = function(key, name, summary) {
  if (!key) {
    throw new Error("Invalid key for month argument");
  };

  if (!name) {
    throw new Error("Invalid name for month argument");
  };

  Observer.call(this, name, summary);

  this.key = key;
  this.days = [];
};

Month.prototype = Object.create(Observer.prototype);

Month.prototype.constructor = Observer;

Month.CALENDAR_DAYS = 42;

Month.PADDING = null;

Month.EVENTS = {
  EACH_DAY: "each:day",
  EACH_DAY_ADDED: "each:day:added"
};

Month.prototype.addDay = function(day, type) {

  if (typeof day === "undefined") {
    throw new Error("Invalid day argument");
  };

  if (day && !day.name) {
    throw new Error("Invalid day.name argument");
  };

  if (type) {
    if (typeof type !== "string") {
      throw new Error("Invalid day-type event argument");
    } else {
      this.emit(type, day);
    };
  };

  this.days.push(day);
};

module.exports = Month;
