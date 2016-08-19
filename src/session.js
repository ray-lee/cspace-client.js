import cspace from 'cspace-api';
import urljoin from 'url-join';
import tokenStore from './tokenStore';

const defaultSessionConfig = {
  username: '',
  password: '',
};

export default function session(sessionConfig) {
  const config = Object.assign({}, defaultSessionConfig, sessionConfig);
  const authStore = tokenStore(config.clientId, config.url, config.username);

  let authRenewRequest = null;
  let auth = authStore.fetch();

  const cs = cspace({
    url: urljoin(config.url, 'cspace-services'),
  });

  const csAuth = cspace({
    url: urljoin(config.url, 'cspace-services/oauth'),
    username: config.clientId,
    password: config.clientSecret,
    type: 'application/x-www-form-urlencoded',
  });

  const storeToken = (response) => {
    auth = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };

    authStore.store(auth);

    // We have tokens, so the username/password can be discarded.

    delete config.username;
    delete config.password;

    return response;
  };

  const getAuthToken = () =>
    csAuth.create('token', {
      data: {
        grant_type: 'password',
        username: config.username,
        password: config.password,
      },
    })
    .then(response => storeToken(response));

  const renewAuthToken = () => {
    if (!authRenewRequest) {
      authRenewRequest = csAuth.create('token', {
        data: {
          grant_type: 'refresh_token',
          refresh_token: auth.refreshToken,
        },
      })
      .then(response => storeToken(response))
      .then(response => {
        authRenewRequest = null;

        return response;
      });
    }

    return authRenewRequest;
  };

  const tokenizeRequest = (requestConfig) =>
    Object.assign({}, requestConfig, { token: auth.accessToken });

  const tokenized = (operation) => (resource, requestConfig) =>
    cs[operation](resource, tokenizeRequest(requestConfig))
      .catch(error => {
        if (error.response.status === 401 && auth.refreshToken) {
          // Renew the access token, and retry the request.

          return renewAuthToken()
            .then(() => cs[operation](resource, tokenizeRequest(requestConfig)));
        }

        return Promise.reject(error);
      });

  return {
    config() {
      return config;
    },

    login() {
      return getAuthToken();
    },

    logout() {
      return new Promise(resolve => {
        // Currently this does not need to be async, but it might in the future.
        // For now just force async with setTimeout.

        setTimeout(() => {
          auth = {};
          authStore.clear();

          resolve();
        });
      });
    },

    create: tokenized('create'),
    read: tokenized('read'),
    update: tokenized('update'),
    delete: tokenized('delete'),
  };
}
