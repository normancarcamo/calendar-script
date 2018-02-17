import { expect } from 'chai'
import Observer from '../../src/node/classes/Observer'
import Day from '../../src/node/classes/Day'

export default function() {
  describe('Day:', () => {
    context('#constructor(key: number, name: string[, summary: object])', () => {
      it('should throw error when the "key" is not passed', () => {
        expect(() => new Day()).to.Throw('Invalid "key" for Day')
      })
      it('should throw error when the "key" is not a number', () => {
        expect(() => new Day("")).to.Throw('Invalid "key" for Day')
      })
      it('should throw error when the "name" is not passed', () => {
        expect(() => new Day(1)).to.Throw('Invalid "name" for Day')
      })
      it('should throw error when the "name" is not a string', () => {
        expect(() => new Day(1, 9)).to.Throw('Invalid "name" for Day')
      })
      it('should be prototype of Observer', () => {
        expect(new Day(0, "Sunday")).to.be.an.instanceof(Observer);
      });
      it('should have the properties "key", "name", "abbr", "letter"', () => {
        expect(new Day(1, "Monday")).to.include.all.keys(
          'key', 'name', 'abbr', 'letter'
        );
      });
      it('should optionally have a property called "summary" an object\n', () => {
        expect(new Day(1, "Monday", { workday: true }))
        .to.have.a.property('summary')
        .that.is.an('object');
      });
    });
  })
}
