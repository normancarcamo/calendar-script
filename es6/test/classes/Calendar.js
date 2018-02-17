import { expect } from 'chai'
import Observer from '../../src/node/classes/Observer'
import Year from '../../src/node/classes/Year'
import Month from '../../src/node/classes/Month'
import Day from '../../src/node/classes/Day'
import Calendar from '../../src/node/classes/Calendar'

export default function() {
  describe('Calendar:', () => {
    context('#static variables', () => {
      it('should have a property called "EVENTS"', () => {
        expect(Calendar).to.have.a.property('EVENTS').that.is.an('object');
      });
      it('should "EVENTS" include "EACH_YEAR" & "EACH_YEAR_ADDED"', () => {
        expect(Calendar.EVENTS).to.include({
          EACH_YEAR: 'each:year',
          EACH_YEAR_ADDED: 'each:year:added'
        });
      });
    });

    context('#constructor()', () => {
      let calendar;

      beforeEach(() => {
        calendar = new Calendar();
      });

      it('should be prototype of Observer', () => {
        expect(calendar).to.be.an.instanceof(Observer);
      });
      it('should have the property "today" & "years"', () => {
        expect(calendar)
          .to.be.an('object')
          .that.includes.all.keys('today', 'years');
      });
    });

    context('#addYear(year: Year[, action: string, callback: function])', () => {
      let calendar, called;

      beforeEach(() => {
        calendar = new Calendar();
        called = false;
      });

      it('should be a function', () => {
        expect(calendar).to.have.a.property('addYear').that.is.a('function');
      });
      it('should throw error when no parameters were found', () => {
        expect(() => calendar.addYear()).to.throw('Invalid arguments');
      });
      it('should throw error the parameter year is not valid', () => {
        expect(() => calendar.addYear(null)).to.throw('Invalid year');
      });
      it('should add a valid year to the years list', () => {
        calendar.addYear(2010);
        expect(calendar.years).to.include.key('2010');
      });
      it('should throw error when the callback is not a function', () => {
        expect(() => calendar.addYear(2010, 23)).to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        calendar.addYear(2010, () => { called = true; });
        expect(called).to.be.true;
      });
      it('should return the calendar instance', () => {
        expect(calendar.addYear(2010)).to.be.instanceof(Calendar);
      });
    });

    context('#build(year: Year[, callback: function])', () => {
      let calendar, called;

      beforeEach(() => {
        calendar = new Calendar();
        called = false;
      });

      it('should throw error when no parameter were found', () => {
        expect(() => calendar.build()).to.Throw('Invalid year');
      });
      it('should throw error when the year parameter is not a Year', () => {
        expect(() => calendar.build(null)).to.Throw('Invalid year');
      });
      it('should add a valid year instance', () => {
        expect(calendar.build(new Year(2010)))
          .to.have.a.property('key', 2010);
      });
      it('should throw error when the callback is not a function', () => {
        expect(() => calendar.build(new Year(2010), 34))
          .to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        calendar.build(new Year(2010), function cb() { called = true; });
        expect(called).to.be.true;
      });
      it('should return the year instance', () => {
        expect(calendar.build(new Year(2010))).to.be.instanceof(Year);
      });
    });

    context('#filter(options: object[, callback: function])', () => {
      let calendar, called;

      beforeEach(() => {
        calendar = new Calendar();
        called = false;
      });

      it('should be a function', () => {
        expect(calendar).to.have.a.property('filter').that.is.a('function');
      });
      it('should throw error when arguments are not present', () => {
        expect(() => calendar.filter()).to.Throw('Invalid options');
      });
      it('should throw error when the options object is empty', () => {
        expect(() => calendar.filter({})).to.Throw('Invalid options');
      });
      it('should throw error when not present "year" or "from"', () => {
        expect(() => calendar.filter({name: null})).to.Throw('Invalid options');
      });
      it('should throw error when "year" is present but invalid', () => {
        expect(() => calendar.filter({year: '2323'})).to.Throw('Invalid year');
      });
      it('should have a new "year" added in the list of years', () => {
        expect(calendar.filter({ year: 2010 }))
          .includes.a.property('years')
          .and.that.has.a.property('2010')
      });
      it('should return the calendar instance when "year" is valid', () => {
        expect(calendar.filter({ year: 2010 })).to.be.instanceof(Calendar);
      });
      it('should throw error when "from" is present but invalid', () => {
        expect(() => calendar.filter({from: '2323'})).to.Throw('Invalid from');
      });
      it('should have a new "year" added in the list of years', () => {
        expect(calendar.filter({ from: 2010 }))
          .includes.a.property('years')
          .and.that.has.a.property('2010')
      });
      it('should throw error when the callback is not a function', () => {
        expect(() => calendar.filter({ from: 2010 }, 343))
          .to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        calendar.filter({ from: 2010 }, function() { called = true; });
        expect(called).to.be.true;
      });
      it('should return the calendar instance when "from" is valid', () => {
        expect(calendar.filter({ from: 2010 })).to.be.instanceof(Calendar);
      });
    });

    context('#daysWithPadding(month: Month)', () => {
      let calendar;

      beforeEach(() => {
        calendar = new Calendar();
      });

      it('should be a function', () => {
        expect(calendar)
          .to.have.a.property('daysWithPadding')
          .that.is.a('function');
      });
      it('should throw error when arguments are not present', () => {
        expect(() => calendar.daysWithPadding()).to.Throw(
          'Invalid arguments'
        );
      });
      it('should throw error when month type is invalid', () => {
        expect(() => calendar.daysWithPadding(23)).to.Throw('Invalid month');
      });
      it('should add padding to each month', () => {
        calendar.on('each:year', function(year) {
          year.on('each:month:added', function(month) {
            let result = calendar.daysWithPadding(month);
            expect(Object.keys(result)).to.include.members([
              'days', 'prev', 'next'
            ]);
          });
        });
        calendar.filter({ year: 2010 });
      });
    });

    context('#filterDaysPerWeek(days: array)', () => {
      let calendar;

      beforeEach(() => {
        calendar = new Calendar();
      });

      it('should be a function', () => {
        expect(calendar)
          .to.have.a.property('filterDaysPerWeek')
          .that.is.a('function');
      });
      it('should throw error when arguments are not present', () => {
        expect(() => calendar.filterDaysPerWeek())
          .to.Throw('Invalid arguments');
      });
      it('should throw error when days type is invalid', () => {
        expect(() => calendar.filterDaysPerWeek(23))
          .to.Throw('Invalid days');
      });
      it('should throw error when days are an empty array', () => {
        expect(() => calendar.filterDaysPerWeek([]))
          .to.Throw('Invalid days');
      });
      it('should divide the days into weeks and return an array', () => {
        calendar.on('each:year', function(year) {
          year.on('each:month:added', function(month) {
            let weeks = calendar.filterDaysPerWeek(month.days)
            expect(weeks.length >= 4).to.be.true;
          });
        });
        calendar.filter({ year: 2010 });
      });
      it('should divide days in weeks and with padding', () => {
        calendar.on('each:year', function(year) {
          year.on('each:month:added', function(month) {
            let result = calendar.daysWithPadding(month);
            let weeks = calendar.filterDaysPerWeek(result.days);
            expect(weeks.length).to.equal(6);
          });
        });
        calendar.filter({ year: 2010 });
      });
    });
  });
}
