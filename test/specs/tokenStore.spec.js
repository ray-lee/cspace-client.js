/* global localStorage */

import chai from 'chai';
import tokenStore from '../../src/tokenStore';

chai.should();

describe('tokenStore', () => {
  describe('tokenStore()', () => {
    it('should return an object', () => {
      tokenStore('user@xyz.com', 'http://xyz.com').should.be.an('object')
        .that.includes.keys('store', 'fetch', 'clear');
    });
  });
});
