import { expect } from 'chai'
import Observer from '../../src/node/classes/Observer'
import Month from '../../src/node/classes/Month'
import Day from '../../src/node/classes/Day'

export default function() {
  describe('Month:', () => {
    context('#static variables', () => {
      it('should have a property called "EVENTS"', () => {
        expect(Month).to.have.a.property('EVENTS').that.is.an('object');
      });
      it('should "EVENTS" include "EACH_DAY" & "EACH_DAY_ADDED"', () => {
        expect(Month.EVENTS).to.include({
          EACH_DAY: 'each:day',
          EACH_DAY_ADDED: 'each:day:added'
        });
      });
    });

    context('#constructor(key: number, name: string[, summary: object])', () => {
      it('should throw error when the "key" is not passed', () => {
        expect(() => new Month()).to.Throw('Invalid "key" for Month');
      });
      it('should throw error when the "key" is not a number', () => {
        expect(() => new Month("")).to.Throw('Invalid "key" for Month');
      });
      it('should throw error when the "name" is not passed', () => {
        expect(() => new Month(1)).to.Throw('Invalid "name" for Month');
      });
      it('should throw error when the "name" is not a string', () => {
        expect(() => new Month(1, 9)).to.Throw('Invalid "name" for Month');
      });
      it('should be prototype of Observer', () => {
        expect(new Month(1, "January")).to.be.an.instanceof(Observer);
      });
      it('should have the properties "key", "name", "abbr", "letter", "days"', () => {
        expect(new Month(1, "January")).to.include.all.keys(
          'key', 'name', 'abbr', 'letter', 'days'
        );
      });
      it('should optionally have a property called "summary" an object', () => {
        expect(new Month(1, 'January', { start: 0, end: 31 }))
        .to.have.a.property('summary')
        .that.is.an('object');
      });
    });

    context('#addDay(day: Day[, action: string, callback: function])', () => {
      it('should be a function', () => {
        let month = new Month(1, 'January');
        expect(month).to.have.a.property('addDay').that.is.a('function');
      });
      it('should throw error when no parameters are found', () => {
        let month = new Month(1, 'January');
        expect(() => month.addDay()).to.throw('Invalid arguments');
      });
      it('should throw error the day parameter is not valid', () => {
        let month = new Month(1, 'January');
        expect(() => month.addDay(null)).to.throw('Invalid day');
      });
      it('should add a valid day to the days list', () => {
        let month = new Month(1, 'January');
        let day = new Day(1, "Monday");
        month.addDay(day);
        expect(month.days.length).to.equal(1);
      });
      it('should throw error when the action parameter is invalid', () => {
        let month = new Month(1, 'January');
        let day = new Day(1, "Monday");
        expect(() => month.addDay(day, 49)).to.Throw('Invalid action');
      });
      it('should emit the action when passing a valid action name', () => {
        let month = new Month(1, 'January');
        let day = new Day(1, "Monday");
        let invoked = false;
        month.on('add', function(day) { invoked = true; });
        month.addDay(day, 'add');
        expect(invoked).to.be.true;
      });
      it('should throw error when the callback is not a function', () => {
        let month = new Month(1, 'January');
        let day = new Day(1, "Monday");
        expect(() => month.addDay(day, null, 78)).to.Throw('Invalid callback');
      });
      it('should not throw error when the callback is a valid function', () => {
        let month = new Month(1, 'January');
        let day = new Day(1, "Monday");
        let called = false;
        month.addDay(day, null, () => { called = true; });
        expect(called).to.be.true;
      });
      it('should return the month instance\n', () => {
        let month = new Month(1, 'January');
        expect(month).to.be.instanceof(Observer);
      });
    });
  });
}
