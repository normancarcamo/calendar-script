"use strict";

var Observer = function(name, summary) {
  if (name) {
    this.name = name ? name.toLowerCase() : "";
    this.abbr = this.name.substring(0, 3);
  };

  if (summary) {
    this.summary = summary;
  };

  this.observers = {};
};

Observer.prototype.on = function(type, observer) {
  if (!this.observers[type]) {
    this.observers[type] = { notify: observer };
  } else {
    this.observers[type].notify = observer;
  };
};

Observer.prototype.off = function(type) {
  if (this.observers[type]) {
    delete this.observers[type];
  };
};

Observer.prototype.emit = function(type, data) {
  if (this.observers[type]) {
    var args = Array.prototype.slice.call(arguments).slice(1);
    this.observers[type].notify.apply(this, args);
  };
};

Observer.prototype.emitAll = function() {
  Object.keys(this.observers).forEach(function(type) {
    if (this.observers[type]) {
      this.observers[type].notify.call(this);
    };
  }, this);
};

module.exports = Observer;
