/* global localStorage */

import chai from 'chai';
import localStorageTokenStore from '../../src/localStorageTokenStore';
import { isLocalStorageAvailable, storeKey } from '../../src/tokenUtils';

const expect = chai.expect;

chai.should();

describe('localStorageTokenStore', function suite() {
  beforeEach(function check() {
    if (!isLocalStorageAvailable()) {
      this.skip();
    }
  });

  const storeParams = ['client-id', 'http://collectionspace.org', 'user@xyz.com'];
  const store = localStorageTokenStore(...storeParams);

  const accessTokenKey = storeKey(...storeParams, 'accessToken');
  const refreshTokenKey = storeKey(...storeParams, 'refreshToken');

  const auth = {
    accessToken: 'a123',
    refreshToken: 'r000',
  };

  const auth2 = {
    accessToken: 'A456',
    refreshToken: 'R999',
  };

  describe('store()', () => {
    it('should put tokens into local storage', () => {
      store.store(auth);

      localStorage.getItem(accessTokenKey).should.equal('a123');
      localStorage.getItem(refreshTokenKey).should.equal('r000');
    });

    it('should overwrite existing tokens in local storage', () => {
      store.store(auth2);

      localStorage.getItem(accessTokenKey).should.equal('A456');
      localStorage.getItem(refreshTokenKey).should.equal('R999');
    });
  });

  describe('fetch()', () => {
    it('should retrieve tokens from local storage', () => {
      store.fetch().should.deep.equal({
        accessToken: 'A456',
        refreshToken: 'R999',
      });

      localStorage.setItem(accessTokenKey, 'aNEW');

      store.fetch().should.deep.equal({
        accessToken: 'aNEW',
        refreshToken: 'R999',
      });

      localStorage.setItem(refreshTokenKey, 'rNEW');

      store.fetch().should.deep.equal({
        accessToken: 'aNEW',
        refreshToken: 'rNEW',
      });
    });

    it('should find stored tokens from any instance', () => {
      const newStore = localStorageTokenStore(...storeParams);

      newStore.fetch().should.deep.equal({
        accessToken: 'aNEW',
        refreshToken: 'rNEW',
      });
    });
  });

  describe('clear()', () => {
    it('should remove tokens from local storage', () => {
      store.clear();

      store.fetch().should.deep.equal({
        accessToken: null,
        refreshToken: null,
      });

      expect(localStorage.getItem(accessTokenKey)).to.equal(null);
      expect(localStorage.getItem(refreshTokenKey)).to.equal(null);
    });
  });
});
