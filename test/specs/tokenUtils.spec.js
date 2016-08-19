import chai from 'chai';
import { authTokens, isLocalStorageAvailable, storeKey } from '../../src/tokenUtils';

chai.should();

describe('storageUtils', () => {
  const inNode = (typeof window === 'undefined');

  describe('authTokens()', () => {
    it('should return an array', () => {
      authTokens().should.be.an('array');
    });
  });

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

  describe('storeKey()', () => {
    it('should encode the parts and join them with \':\'', () => {
      storeKey('foo@bar:hi', 'abc:123@xyz.com', 'http://xyz.com:8180')
        .should.equal('foo%40bar%3Ahi:abc%3A123%40xyz.com:http%3A%2F%2Fxyz.com%3A8180');
    });
  });
});
