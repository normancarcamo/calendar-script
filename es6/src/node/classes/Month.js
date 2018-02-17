import Observer from './Observer'
import Day from './Day'

class Month extends Observer {
  static get EVENTS() {
    return {
      EACH_DAY: 'each:day',
      EACH_DAY_ADDED: 'each:day:added'
    };
  }

  constructor(key, name, summary) {
    super()

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

export default Month;
