/* global localStorage, JSON */

import { storageKey } from './tokenHelpers';

const loadClientData = (clientId) => {
  const data = JSON.parse(localStorage.getItem(storageKey));

  return (data ? data[clientId] : undefined);
};

const saveClientData = (clientId, clientData) => {
  const data = JSON.parse(localStorage.getItem(storageKey));

  const updatedData = Object.assign({}, data, {
    [clientId]: clientData,
  });

  localStorage.setItem(storageKey, JSON.stringify(updatedData));
};

const withClientData = (clientId, update) => {
  const clientData = loadClientData(clientId);
  const updatedClientData = update(clientData);

  saveClientData(clientId, updatedClientData);
};

export default function localStorageTokenStore(clientId, url) {
  return {
    store(auth) {
      withClientData(clientId, clientData =>
        Object.assign({}, clientData, {
          [url]: auth,
        })
      );
    },

    fetch() {
      const clientData = loadClientData(clientId);

      return (clientData ? clientData[url] : undefined);
    },

    clear() {
      withClientData(clientId, clientData =>
        Object.assign({}, clientData, {
          [url]: undefined,
        })
      );
    },
  };
}
