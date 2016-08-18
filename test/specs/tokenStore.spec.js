/* global localStorage */

import chai from 'chai';
import tokenStore from '../../src/tokenStore';
import { isLocalStorageAvailable, localStorageKey } from '../../src/localStorage';

const expect = chai.expect;

chai.should();

describe('tokenStore', () => {
  const store = tokenStore('user@xyz.com', 'http://collectionspace.org');

  const auth = {
    accessToken: 'a123',
    refreshToken: 'r000',
  };

  const auth2 = {
    accessToken: 'A456',
    refreshToken: 'R999',
  };

  if (isLocalStorageAvailable()) {
    context('local storage available', () => {
      describe('store()', () => {
        it('should put tokens into local storage', () => {
          store.store(auth);

          localStorage
            .getItem(localStorageKey('accessToken', 'user@xyz.com', 'http://collectionspace.org'))
            .should.equal('a123');

          localStorage
            .getItem(localStorageKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org'))
            .should.equal('r000');
        });

        it('should overwrite existing tokens in local storage', () => {
          store.store(auth2);

          localStorage
            .getItem(localStorageKey('accessToken', 'user@xyz.com', 'http://collectionspace.org'))
            .should.equal('A456');

          localStorage
            .getItem(localStorageKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org'))
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
            .setItem(localStorageKey('accessToken', 'user@xyz.com', 'http://collectionspace.org'), 'aNEW');

          store.fetch().should.deep.equal({
            accessToken: 'aNEW',
            refreshToken: 'R999',
          });

          localStorage
            .setItem(localStorageKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org'), 'rNEW');

          store.fetch().should.deep.equal({
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
            .getItem(localStorageKey('accessToken', 'user@xyz.com', 'http://collectionspace.org')))
            .to.equal(null);

          expect(localStorage
            .getItem(localStorageKey('refreshToken', 'user@xyz.com', 'http://collectionspace.org')))
            .to.equal(null);
        });
      });
    });
  } else {
    context('local storage not available', () => {
      describe('fetch()', () => {
        it('should return null tokens', () => {
          store.fetch().should.deep.equal({
            accessToken: null,
            refreshToken: null,
          });
        });
      });
    });
  }
});
