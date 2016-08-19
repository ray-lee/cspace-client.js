import { isLocalStorageAvailable } from './tokenUtils';
import localStorageTokenStore from './localStorageTokenStore';
import memoryTokenStore from './memoryTokenStore';

export default function tokenStore(clientId, url, username) {
  const store = isLocalStorageAvailable() ? localStorageTokenStore : memoryTokenStore;

  return store(clientId, url, username);
}
