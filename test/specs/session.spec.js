import chai from 'chai';
import session from '../../src/session';

chai.should();

describe('session', () => {
  describe('session()', () => {
    it('should return a new session instance', () => {
      session().should.be.an('object')
        .that.includes.keys('login', 'logout', 'create', 'read', 'update', 'delete');
    });

    it('should set default options', () => {
      session().config().should.deep.equal({
        username: '',
        password: '',
      });
    });

    it('should override default options with passed options', () => {
      const config = {
        username: 'user@collectionspace.org',
        password: 'secret',
      };

      session(config).config().should.deep.equal({
        username: 'user@collectionspace.org',
        password: 'secret',
      });
    });
  });
});
