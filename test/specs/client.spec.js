import chai from 'chai';
import client from '../../src/client';

chai.should();

describe('client', () => {
  describe('client()', () => {
    it('should return a new client instance', () => {
      client().should.be.an('object')
        .that.includes.keys('config', 'session');
    });

    it('should set default options', () => {
      client().config().should.deep.equal({
        clientId: 'cspace-ui',
        clientSecret: '',
      });
    });

    it('should override default options with passed options', () => {
      const config = {
        clientId: 'my-id',
        clientSecret: 'topsecret',
      };

      client(config).config().should.deep.equal({
        clientId: 'my-id',
        clientSecret: 'topsecret',
      });
    });
  });
});
