const storage = {};

export default function memoryTokenStore(clientId, url) {
  return {
    store(auth) {
      let clientData = storage.clientId;

      if (!clientData) {
        storage.clientId = {};

        clientData = storage.clientId;
      }

      clientData[url] = auth;
    },

    fetch() {
      const clientData = storage.clientId;

      return clientData ? clientData[url] : undefined;
    },

    clear() {
      const clientData = storage.clientId;

      if (clientData) {
        delete clientData[url];
      }
    },
  };
}
