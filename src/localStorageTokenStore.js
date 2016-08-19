/* global localStorage */

import { authTokens, storeKey } from './tokenUtils';

export default function localStorageTokenStore(clientId, url, username) {
  return {
    store(auth) {
      authTokens().forEach(token =>
        localStorage.setItem(storeKey(clientId, url, username, token), auth[token]));
    },

    fetch() {
      const auth = {};

      authTokens().forEach(token => {
        auth[token] = localStorage.getItem(storeKey(clientId, url, username, token));
      });

      return auth;
    },

    clear() {
      authTokens().forEach(token =>
        localStorage.removeItem(storeKey(clientId, url, username, token)));
    },
  };
}
