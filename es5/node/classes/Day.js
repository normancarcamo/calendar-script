"use strict";

var Observer = require("./Observer.js");

var Day = function(key, name, summary) {
  Observer.call(this, name, summary);

  if (typeof key === 'number') {
    this.key = key;
  };

  this.letter = this.name.charAt(0);
};

Day.prototype = Object.create(Observer.prototype);
Day.prototype.constructor = Observer;

module.exports = Day;
