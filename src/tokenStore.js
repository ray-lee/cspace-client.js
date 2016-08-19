import { isLocalStorageAvailable } from './tokenUtils';
import localStorageTokenStore from './localStorageTokenStore';
import memoryTokenStore from './memoryTokenStore';

export default function tokenStore(username, url) {
  const store = isLocalStorageAvailable() ? localStorageTokenStore : memoryTokenStore;

  return store(username, url);
}
