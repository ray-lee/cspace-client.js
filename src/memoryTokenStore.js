import { authTokens, storeKey } from './tokenUtils';

const tokens = {};

export default function memoryTokenStore(clientId, url, username) {
  return {
    store(auth) {
      authTokens().forEach(token => {
        tokens[storeKey(clientId, url, username, token)] = auth[token];
      });
    },

    fetch() {
      const auth = {};

      authTokens().forEach(token => {
        auth[token] = tokens[storeKey(clientId, url, username, token)];
      });

      return auth;
    },

    clear() {
      authTokens().forEach(token => {
        delete tokens[storeKey(clientId, url, username, token)];
      });
    },
  };
}
