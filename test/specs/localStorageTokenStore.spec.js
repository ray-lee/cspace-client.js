/* global localStorage */

import chai from 'chai';
import localStorageTokenStore from '../../src/localStorageTokenStore';
import { isLocalStorageAvailable, storageKey } from '../../src/tokenHelpers';

const expect = chai.expect;

chai.should();

describe('localStorageTokenStore', function suite() {
  beforeEach(function check() {
    if (!isLocalStorageAvailable()) {
      this.skip();
    }
  });

  const clientId = 'client-id';
  const url = 'http://collectionspace.org';
  const storeParams = [clientId, url];
  const store = localStorageTokenStore(...storeParams);

  const auth = {
    username: 'user@xyz.com',
    accessToken: 'a123',
    refreshToken: 'r000',
  };

  const auth2 = {
    username: 'user@xyz.com',
    accessToken: 'A456',
    refreshToken: 'R999',
  };

  describe('store()', () => {
    it('should put tokens into local storage', () => {
      store.store(auth);

      JSON.parse(localStorage.getItem(storageKey))[clientId][url].should.deep.equal(auth);
    });

    it('should overwrite existing tokens in local storage', () => {
      store.store(auth2);

      JSON.parse(localStorage.getItem(storageKey))[clientId][url].should.deep.equal(auth2);
    });

    it('should not affect stored data for other client ids', () => {
      localStorage.setItem(storageKey, JSON.stringify({
        foo: 'bar',
      }));

      store.store(auth2);

      JSON.parse(localStorage.getItem(storageKey))[clientId][url].should.deep.equal(auth2);
      JSON.parse(localStorage.getItem(storageKey)).foo.should.equal('bar');
    });
  });

  describe('fetch()', () => {
    it('should retrieve tokens', () => {
      store.fetch().should.deep.equal(auth2);
    });

    it('should find stored tokens from any instance', () => {
      const newStore = localStorageTokenStore(...storeParams);

      newStore.fetch().should.deep.equal(auth2);
    });
  });

  describe('clear()', () => {
    it('should remove tokens from local storage', () => {
      store.clear();

      expect(store.fetch()).to.equal(undefined);
    });
  });
});
