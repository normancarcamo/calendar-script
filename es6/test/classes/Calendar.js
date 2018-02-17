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
      it('should be prototype of Observer', () => {
        expect(new Calendar()).to.be.an.instanceof(Observer);
      });
      it('should have the property "today" & "years"', () => {
        expect(new Calendar())
          .to.be.an('object')
          .that.includes.all.keys('today', 'years');
      });
    });

    context('#addYear(year: Year[, action: string, callback: function])', () => {
      it('should be a function', () => {
        let calendar = new Calendar();
        expect(calendar).to.have.a.property('addYear').that.is.a('function');
      });
      it('should throw error when no parameters were found', () => {
        let calendar = new Calendar();
        expect(() => calendar.addYear()).to.throw('Invalid arguments');
      });
      it('should throw error the parameter year is not valid', () => {
        let calendar = new Calendar();
        expect(() => calendar.addYear(null)).to.throw('Invalid year');
      });
      it('should add a valid year to the years list', () => {
        let calendar = new Calendar();
        calendar.addYear(2010);
        expect(calendar.years).to.include.key('2010');
      });
      it('should throw error when the callback is not a function', () => {
        let calendar = new Calendar();
        expect(() => calendar.addYear(2010, 23)).to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        let calendar = new Calendar();
        let called = false;
        calendar.addYear(2010, () => { called = true; });
        expect(called).to.be.true;
      });
      it('should return the calendar instance', () => {
        let calendar = new Calendar();
        expect(calendar.addYear(2010)).to.be.instanceof(Calendar);
      });
    });

    context('#build(year: Year[, callback: function])', () => {
      it('should throw error when no parameter were found', () => {
        const calendar = new Calendar();
        expect(() => calendar.build()).to.Throw('Invalid year');
      });
      it('should throw error when the year parameter is not a Year', () => {
        const calendar = new Calendar();
        expect(() => calendar.build(null)).to.Throw('Invalid year');
      });
      it('should add a valid year instance', () => {
        const calendar = new Calendar();
        const year = new Year(2010);
        const result = calendar.build(year);
        expect(result).to.have.a.property('key', 2010);
      });
      it('should throw error when the callback is not a function', () => {
        const calendar = new Calendar();
        const year = new Year(2010);
        expect(() => calendar.build(year, 34)).to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        let calendar = new Calendar();
        let year = new Year(2010);
        let called = false;
        calendar.build(year, function cb() { called = true; });
        expect(called).to.be.true;
      });
      it('should return the year instance', () => {
        let calendar = new Calendar();
        let year = new Year(2010);
        let result = calendar.build(year);
        expect(result).to.be.instanceof(Year);
      });
    });

    context('#filter(options: object[, callback: function])', () => {
      it('should be a function', () => {
        let calendar = new Calendar();
        expect(calendar).to.have.a.property('filter').that.is.a('function');
      });
      it('should throw error when arguments are not present', () => {
        let calendar = new Calendar();
        expect(() => calendar.filter()).to.Throw('Invalid options');
      });
      it('should throw error when the options object is empty', () => {
        let calendar = new Calendar();
        expect(() => calendar.filter({})).to.Throw('Invalid options');
      });
      it('should throw error when not present "year" or "from"', () => {
        let calendar = new Calendar();
        expect(() => calendar.filter({name: null})).to.Throw('Invalid options');
      });
      it('should throw error when "year" is present but invalid', () => {
        let calendar = new Calendar();
        expect(() => calendar.filter({year: '2323'})).to.Throw('Invalid year');
      });
      it('should have a new "year" added in the list of years', () => {
        let calendar = new Calendar();
        expect(calendar.filter({ year: 2010 }))
          .includes.a.property('years')
          .and.that.has.a.property('2010')
      });
      it('should return the calendar instance when "year" is valid', () => {
        let calendar = new Calendar();
        expect(calendar.filter({ year: 2010 })).to.be.instanceof(Calendar);
      });
      it('should throw error when "from" is present but invalid', () => {
        let calendar = new Calendar();
        expect(() => calendar.filter({from: '2323'})).to.Throw('Invalid from');
      });
      it('should have a new "year" added in the list of years', () => {
        let calendar = new Calendar();
        expect(calendar.filter({ from: 2010 }))
          .includes.a.property('years')
          .and.that.has.a.property('2010')
      });
      it('should throw error when the callback is not a function', () => {
        const calendar = new Calendar();
        expect(() => calendar.filter({ from: 2010 }, 343))
          .to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        let calendar = new Calendar();
        let called = false;
        calendar.filter({ from: 2010 }, function() { called = true; });
        expect(called).to.be.true;
      });
      it('should return the calendar instance when "from" is valid', () => {
        let calendar = new Calendar();
        expect(calendar.filter({ from: 2010 })).to.be.instanceof(Calendar);
      });
    });

    context('#daysWithPadding(month: Month)', () => {
      it('should be a function', () => {
        let calendar = new Calendar();
        expect(calendar)
          .to.have.a.property('daysWithPadding')
          .that.is.a('function');
      });
      it('should throw error when arguments are not present', () => {
        let calendar = new Calendar();
        expect(() => calendar.daysWithPadding()).to.Throw(
          'Invalid arguments'
        );
      });
      it('should throw error when month type is invalid', () => {
        let calendar = new Calendar();
        expect(() => calendar.daysWithPadding(23)).to.Throw('Invalid month');
      });
      it('should add padding to each month', () => {
        let calendar = new Calendar();
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
      it('should be a function', () => {
        let calendar = new Calendar();
        expect(calendar).to.have.a.property('filterDaysPerWeek').that.is.a('function');
      });
      it('should throw error when arguments are not present', () => {
        let calendar = new Calendar();
        expect(() => calendar.filterDaysPerWeek()).to.Throw('Invalid arguments');
      });
      it('should throw error when days type is invalid', () => {
        let calendar = new Calendar();
        expect(() => calendar.filterDaysPerWeek(23)).to.Throw('Invalid days');
      });
      it('should throw error when days are an empty array', () => {
        let calendar = new Calendar();
        expect(() => calendar.filterDaysPerWeek([])).to.Throw('Invalid days');
      });
      it('should divide the days into weeks and return an array', () => {
        let calendar = new Calendar();
        calendar.on('each:year', function(year) {
          year.on('each:month:added', function(month) {
            let weeks = calendar.filterDaysPerWeek(month.days)
            expect(weeks.length >= 4).to.be.true;
          });
        });
        calendar.filter({ year: 2010 });
      });
      it('should divide days in weeks and with padding', () => {
        let calendar = new Calendar();
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
