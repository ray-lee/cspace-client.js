/* global localStorage */

import { authTokens, storeKey } from './tokenUtils';

export default function localStorageTokenStore(username, url) {
  return {
    store(auth) {
      authTokens().forEach(token =>
        localStorage.setItem(storeKey(token, username, url), auth[token]));
    },

    fetch() {
      const auth = {};

      authTokens().forEach(token => {
        auth[token] = localStorage.getItem(storeKey(token, username, url));
      });

      return auth;
    },

    clear() {
      authTokens().forEach(token =>
        localStorage.removeItem(storeKey(token, username, url)));
    },
  };
}
