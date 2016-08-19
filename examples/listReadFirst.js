import client from '../src';
import log from './helpers/log';

const cspace = client({
  url: 'http://nightly.collectionspace.org:8180',
});

const session = cspace.session({
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const getFirst = (listResult) => {
  const list = listResult.data['ns2:abstract-common-list'];
  const uri = (list.itemsInPage > 0) ? list['list-item'][0].uri : null;

  return uri;
};

session.login()
  .then(() => log('logged in'))
  .then(() => session.read('collectionobjects'))
  .then(listResult => log('found items', listResult))
  .then(listResult => getFirst(listResult))
  .then(uri => log('found first item', uri))
  .then(uri => (uri ? session.read(uri) : null))
  .then(result => log('retrieved record', result))
  .then(() => session.logout())
  .then(() => log('logged out'))
  .catch(error => log('error', error));
