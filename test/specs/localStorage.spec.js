import chai from 'chai';
import { isLocalStorageAvailable, localStorageKey } from '../../src/localStorage';

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

  describe('localStorageKey()', () => {
    it('should encode the parts and join them with \':\'', () => {
      localStorageKey('foo@bar:hi', 'abc:123@xyz.com', 'http://xyz.com:8180')
        .should.equal('foo%40bar%3Ahi:abc%3A123%40xyz.com:http%3A%2F%2Fxyz.com%3A8180');
    });
  });
});
