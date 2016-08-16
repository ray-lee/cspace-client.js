import client from '../src';
import log from './helpers/log';

const cspace = client({
  url: 'http://localhost:8180',
});

const session = cspace.session({
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const readFirstItem = (listResult) => {
  const itemsInPage = listResult.data['ns2:abstract-common-list'].itemsInPage;

  if (itemsInPage > 0) {
    const uri = listResult.data['ns2:abstract-common-list']['list-item'][0].uri;

    console.log(`reading ${uri}`);

    return session.read(uri);
  }

  return Promise.resolve({});
};

session.login()
  .then(() => log('logged in'))
  .then(() => session.read('collectionobjects'))
  .then(result => log('found items', result))
  .then(result => readFirstItem(result))
  .then(result => log('retrieved record', result))
  .then(() => session.logout())
  .then(() => log('logged out'))
  .catch(error => log('error', error));
