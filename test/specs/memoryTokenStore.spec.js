import chai from 'chai';
import memoryTokenStore from '../../src/memoryTokenStore';

chai.should();

describe('memoryTokenStore', () => {
  const storeParams = ['client-id', 'http://collectionspace.org', 'user@xyz.com'];
  const store = memoryTokenStore(...storeParams);

  const auth = {
    accessToken: 'a123',
    refreshToken: 'r000',
  };

  const auth2 = {
    accessToken: 'A456',
    refreshToken: 'R999',
  };

  describe('store()', () => {
    it('should save tokens', () => {
      store.store(auth);

      store.fetch().should.deep.equal({
        accessToken: 'a123',
        refreshToken: 'r000',
      });
    });

    it('should overwrite existing tokens in local storage', () => {
      store.store(auth2);

      store.fetch().should.deep.equal({
        accessToken: 'A456',
        refreshToken: 'R999',
      });
    });
  });

  describe('fetch()', () => {
    it('should retrieve tokens', () => {
      store.fetch().should.deep.equal({
        accessToken: 'A456',
        refreshToken: 'R999',
      });
    });

    it('should find stored tokens from any instance', () => {
      const newStore = memoryTokenStore(...storeParams);

      newStore.fetch().should.deep.equal({
        accessToken: 'A456',
        refreshToken: 'R999',
      });
    });
  });

  describe('clear()', () => {
    it('should remove tokens', () => {
      store.clear();

      store.fetch().should.deep.equal({
        accessToken: undefined,
        refreshToken: undefined,
      });
    });
  });
});
