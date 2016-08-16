/* global localStorage */

import { isLocalStorageAvailable, localStorageKey } from './utils/storageUtils';

const authTokens = [
  'accessToken',
  'refreshToken',
];

export default function tokenStore(username, url) {
  if (isLocalStorageAvailable()) {
    return {
      store(auth) {
        authTokens.forEach(token =>
          localStorage.setItem(localStorageKey(token, username, url), auth[token]));
      },

      fetch() {
        const auth = {};

        authTokens.forEach(token => {
          auth[token] = localStorage.getItem(localStorageKey(token, username, url));
        });

        return auth;
      },

      clear() {
        authTokens.forEach(token =>
          localStorage.removeItem(localStorageKey(token, username, url)));
      },
    };
  }

  return {
    store() {
      // Do nothing.
    },

    fetch() {
      const auth = {};

      authTokens.forEach(token => {
        auth[token] = null;
      });

      return auth;
    },

    clear() {
      // Do nothing.
    },
  };
}
