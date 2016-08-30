const storage = {};

export default function memoryTokenStore(clientId, url) {
  return {
    store(auth) {
      let clientStorage = storage.clientId;

      if (!clientStorage) {
        clientStorage = storage.clientId = {};
      }

      clientStorage[url] = auth;
    },

    fetch() {
      const clientStorage = storage.clientId;

      return clientStorage ? clientStorage[url] : null;
    },

    clear() {
      const clientStorage = storage.clientId;

      if (clientStorage) {
        delete clientStorage[url];
      }
    },
  };
}
