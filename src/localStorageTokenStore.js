/* global localStorage, JSON */

const loadClientStorage = clientId =>
  JSON.parse(localStorage.getItem(clientId));

const saveClientStorage = (clientId, clientStorage) =>
  localStorage.setItem(clientId, JSON.stringify(clientStorage));

const withClientStorage = (clientId, callback) => {
  const clientStorage = loadClientStorage(clientId);
  const updatedClientStorage = callback(clientStorage);

  saveClientStorage(clientId, updatedClientStorage);
};

export default function localStorageTokenStore(clientId, url) {
  return {
    store(auth) {
      withClientStorage(clientId, clientStorage =>
        Object.assign({}, clientStorage, {
          [url]: auth,
        }));
    },

    fetch() {
      const clientStorage = loadClientStorage(clientId);

      return clientStorage ? clientStorage[url] : null;
    },

    clear() {
      withClientStorage(clientId, clientStorage =>
        Object.assign({}, clientStorage, {
          [url]: undefined,
        }));
    },
  };
}
