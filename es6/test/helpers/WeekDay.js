import { expect } from 'chai'
import Day from '../../src/node/classes/Day'
import WeekDay from '../../src/node/helpers/WeekDay'

export default function() {
  describe('WeekDay:', () => {
    context('#static variables', () => {
      it('should have a property called "DAYS"', () => {
        expect(WeekDay).to.have.a.property('DAYS').that.is.an('object');
      });
      it('should "DAYS" include 7 indexes, from 0 to 6', () => {
        expect(WeekDay.DAYS).to.include({
          SUNDAY: 0,
          MONDAY: 1,
          TUESDAY: 2,
          WEDNESDAY: 3,
          THURSDAY: 4,
          FRIDAY: 5,
          SATURDAY: 6
        });
      });
    });
    context('#constructor(index: number)', () => {
      it('should throw error when the "index" is not passed', () => {
        expect(() => new WeekDay()).to.Throw('Invalid index');
      });
      it('should throw error when the "index" is not a number', () => {
        expect(() => new WeekDay('fl')).to.Throw('Invalid index');
      });
      it('should throw error when the "index" is greater than 6', () => {
        expect(() => new WeekDay(7)).to.Throw('Invalid index');
      });
      it('should return a Day instance when the index is valid\n', () => {
        expect(new WeekDay(1)).to.be.instanceof(Day);
      });
    });
  })
}
