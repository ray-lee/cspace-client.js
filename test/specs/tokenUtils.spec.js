import chai from 'chai';
import { isLocalStorageAvailable } from '../../src/tokenUtils';

chai.should();

describe('storageUtils', () => {
  const inNode = (typeof window === 'undefined');

  describe('isLocalStorageAvailable()', () => {
    if (inNode) {
      context('in Node.js', () => {
        it('should return false', () => {
          isLocalStorageAvailable().should.equal(false);
        });
      });
    } else {
      context('in a browser', () => {
        it('should return true', () => {
          isLocalStorageAvailable().should.equal(true);
        });
      });
    }
  });
});
