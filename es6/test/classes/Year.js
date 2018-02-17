import { expect } from 'chai'
import Observer from '../../src/node/classes/Observer'
import Year from '../../src/node/classes/Year'
import Month from '../../src/node/classes/Month'
import Day from '../../src/node/classes/Day'

export default function() {
  describe('Year:', () => {
    context('#static variables', () => {
      it('should have a property called "EVENTS"', () => {
        expect(Year).to.have.a.property('EVENTS').that.is.an('object');
      });
      it('should "EVENTS" include "EACH_MONTH" & "EACH_MONTH_ADDED"', () => {
        expect(Year.EVENTS).to.include({
          EACH_MONTH: 'each:month',
          EACH_MONTH_ADDED: 'each:month:added'
        });
      });
    });

    context('#constructor(key: number)', () => {
      it('should throw error when the "key" is not passed', () => {
        expect(() => new Year()).to.Throw('Invalid "key" for Year');
      });
      it('should throw error when the "key" is not a number', () => {
        expect(() => new Year("")).to.Throw('Invalid "key" for Year');
      });
      it('should be prototype of Observer', () => {
        expect(new Year(2010)).to.be.an.instanceof(Observer);
      });
      it('should have the properties "key", "months", "leap", "days"', () => {
        expect(new Year(2011)).to.include.all.keys(
          'key', 'months', 'leap', 'days'
        );
      });
    });

    context('#addMonth(month: Month[, action: string, callback: function])', () => {
      let month, day, year, called;

      beforeEach(() => {
        year = new Year(2010);
        month = new Month(1, 'January');
        day = new Day(1, "Monday");
        month.addDay(day);
        called = false;
      });

      it('should be a function', () => {
        expect(year).to.have.a.property('addMonth').that.is.a('function');
      });
      it('should throw error when no parameters are found', () => {
        expect(() => year.addMonth()).to.throw('Invalid arguments');
      });
      it('should throw error the parameter month is not valid', () => {
        expect(() => year.addMonth(null)).to.throw('Invalid month');
      });
      it('should add a valid month to the months list', () => {
        year.addMonth(month);
        expect(year.months.length).to.equal(1);
      });
      it('should throw error when the action parameter is invalid', () => {
        expect(() => year.addMonth(month, 49)).to.Throw('Invalid action');
      });
      it('should emit the action when passing a valid action name', () => {
        year.on('add', function(day) { called = true; });
        year.addMonth(month, 'add');
        expect(called).to.be.true;
      });
      it('should throw error when the callback is not a function', () => {
        expect(() => year.addMonth(month, null, 78)).to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        year.addMonth(month, null, () => { called = true; });
        expect(called).to.be.true;
      });
      it('should return the year instance\n', () => {
        expect(year.addMonth(month)).to.be.instanceof(Year);
      });
    });
  });
}
