/**
 * Find and delete vocabularies that have no items.
 */

import client from '../src';
import log from './helpers/log';

const cspace = client({
  url: 'http://nightly.collectionspace.org:8180',
});

const session = cspace.session({
  username: 'admin@core.collectionspace.org',
  password: 'Administrator',
});

const getCsids = (listResult) => {
  const list = listResult.data['ns2:abstract-common-list'];
  const items = list['list-item'];

  return (items ? items.map(item => item.csid) : []);
};

const hasItems = listResult => getCsids(listResult).length > 0;

const config = {
  params: {
    pgSz: 0,
  },
};

const emptyVocabularyCsids = [];

session.login()
  .then(() => session.read('vocabularies', config))
  .then(listResult => getCsids(listResult))
  .then(csids => log(`found ${csids.length} vocabularies`, csids))
  .then(csids =>
    Promise.all(
      csids.map(csid =>
        session.read(`vocabularies/${csid}/items`).then((listResult) => {
          if (!hasItems(listResult)) {
            emptyVocabularyCsids.push(csid);
          }
        })
      )
    )
  )
  .then(() => log(`found ${emptyVocabularyCsids.length} empty vocabularies`, emptyVocabularyCsids))
  .then(() =>
    Promise.all(
      emptyVocabularyCsids.map(csid =>
        session.delete(`vocabularies/${csid}`)
          .then(() => log(`deleted ${csid}`))
      )
    )
  )
  .then(() => session.logout())
  .catch(error => log('error', error));
