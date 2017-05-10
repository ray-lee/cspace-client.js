import localStorageTokenStore from './localStorageTokenStore';
import memoryTokenStore from './memoryTokenStore';
import { isLocalStorageAvailable } from './tokenHelpers';

export default function tokenStore(clientId, url, username) {
  const store = isLocalStorageAvailable() ? localStorageTokenStore : memoryTokenStore;

  return store(clientId, url, username);
}
