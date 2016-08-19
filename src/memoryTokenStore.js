import { authTokens, storeKey } from './tokenUtils';

const tokens = {};

export default function memoryTokenStore(username, url) {
  return {
    store(auth) {
      authTokens().forEach(token => {
        tokens[storeKey(token, username, url)] = auth[token];
      });
    },

    fetch() {
      const auth = {};

      authTokens().forEach(token => {
        auth[token] = tokens[storeKey(token, username, url)];
      });

      return auth;
    },

    clear() {
      authTokens().forEach(token => {
        delete tokens[storeKey(token, username, url)];
      });
    },
  };
}
