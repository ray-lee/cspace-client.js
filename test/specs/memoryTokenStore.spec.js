import chai from 'chai';
import memoryTokenStore from '../../src/memoryTokenStore';

const expect = chai.expect;

chai.should();

describe('memoryTokenStore', () => {
  const storeParams = ['client-id', 'http://collectionspace.org'];
  const store = memoryTokenStore(...storeParams);

  const auth = {
    username: 'user@xyz.com',
    accessToken: 'a123',
    refreshToken: 'r000',
  };

  const auth2 = {
    username: 'user@xyz.com',
    accessToken: 'A456',
    refreshToken: 'R999',
  };

  describe('store()', () => {
    it('should save tokens', () => {
      store.store(auth);

      store.fetch().should.deep.equal({
        username: 'user@xyz.com',
        accessToken: 'a123',
        refreshToken: 'r000',
      });
    });

    it('should overwrite existing tokens in local storage', () => {
      store.store(auth2);

      store.fetch().should.deep.equal({
        username: 'user@xyz.com',
        accessToken: 'A456',
        refreshToken: 'R999',
      });
    });
  });

  describe('fetch()', () => {
    it('should retrieve tokens', () => {
      store.fetch().should.deep.equal({
        username: 'user@xyz.com',
        accessToken: 'A456',
        refreshToken: 'R999',
      });
    });

    it('should find stored tokens from any instance', () => {
      const newStore = memoryTokenStore(...storeParams);

      newStore.fetch().should.deep.equal({
        username: 'user@xyz.com',
        accessToken: 'A456',
        refreshToken: 'R999',
      });
    });
  });

  describe('clear()', () => {
    it('should remove tokens', () => {
      store.clear();

      expect(store.fetch()).to.equal(undefined);
    });
  });
});
