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

  const store = localStorageTokenStore('user@xyz.com', 'http://collectionspace.org');

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

      localStorage
        .getItem(storeKey('accessToken', 'user@xyz.com', 'http://collectionspace.org'))
        .should.equal('a123');

      localStorage
        .getItem(storeKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org'))
        .should.equal('r000');
    });

    it('should overwrite existing tokens in local storage', () => {
      store.store(auth2);

      localStorage
        .getItem(storeKey('accessToken', 'user@xyz.com', 'http://collectionspace.org'))
        .should.equal('A456');

      localStorage
        .getItem(storeKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org'))
        .should.equal('R999');
    });
  });

  describe('fetch()', () => {
    it('should retrieve tokens from local storage', () => {
      store.fetch().should.deep.equal({
        accessToken: 'A456',
        refreshToken: 'R999',
      });

      localStorage
        .setItem(storeKey('accessToken', 'user@xyz.com', 'http://collectionspace.org'), 'aNEW');

      store.fetch().should.deep.equal({
        accessToken: 'aNEW',
        refreshToken: 'R999',
      });

      localStorage
        .setItem(storeKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org'), 'rNEW');

      store.fetch().should.deep.equal({
        accessToken: 'aNEW',
        refreshToken: 'rNEW',
      });
    });

    it('should find stored tokens from any instance', () => {
      const newStore = localStorageTokenStore('user@xyz.com', 'http://collectionspace.org');

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

      expect(localStorage
        .getItem(storeKey('accessToken', 'user@xyz.com', 'http://collectionspace.org')))
        .to.equal(null);

      expect(localStorage
        .getItem(storeKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org')))
        .to.equal(null);
    });
  });
});
