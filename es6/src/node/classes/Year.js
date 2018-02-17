import Observer from './Observer'
import Month from './Month'

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
      }
    };

    return this;
  }
}

export default Year;
