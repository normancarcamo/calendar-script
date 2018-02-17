import { expect } from 'chai'
import Month from '../../src/node/classes/Month'
import Months from '../../src/node/helpers/Months'

export default function() {
  describe('Months:', () => {
    context('#constructor(leap: Boolean)', () => {
      it('should throw error when the "leap" is not passed', () => {
        expect(() => new Months()).to.Throw('Invalid leap');
      });
      it('should throw error when the "leap" is not a boolean', () => {
        expect(() => new Months('fl')).to.Throw('Invalid leap');
      });
      it('should return 12 instances of a Month when leap is valid\n', () => {
        let months = new Months(true);
        expect(months).to.be.an('array').that.have.lengthOf(12);
        months.map(month => expect(month).to.be.instanceof(Month));
      });
    });
  })
}
