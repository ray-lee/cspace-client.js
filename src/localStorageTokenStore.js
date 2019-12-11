/* global window */

import { storageKey } from './tokenHelpers';

const loadClientData = (clientId) => {
  const data = window.JSON.parse(window.localStorage.getItem(storageKey));

  return (data ? data[clientId] : undefined);
};

const saveClientData = (clientId, clientData) => {
  const data = window.JSON.parse(window.localStorage.getItem(storageKey));

  const updatedData = {
    ...data,
    [clientId]: clientData,
  };

  window.localStorage.setItem(storageKey, window.JSON.stringify(updatedData));
};

const withClientData = (clientId, update) => {
  const clientData = loadClientData(clientId);
  const updatedClientData = update(clientData);

  saveClientData(clientId, updatedClientData);
};

export default function localStorageTokenStore(clientId, url) {
  return {
    store(auth) {
      withClientData(clientId, (clientData) => ({
        ...clientData,
        [url]: auth,
      }));
    },

    fetch() {
      const clientData = loadClientData(clientId);

      return (clientData ? clientData[url] : undefined);
    },

    clear() {
      withClientData(clientId, (clientData) => ({
        ...clientData,
        [url]: undefined,
      }));
    },
  };
}
