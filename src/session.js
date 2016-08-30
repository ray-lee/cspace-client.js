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

  let auth = authStore.fetch();
  let authRequestPending = null;

  const cs = cspace({
    url: urljoin(config.url, 'cspace-services'),
  });

  const csAuth = cspace({
    url: urljoin(config.url, 'cspace-services/oauth'),
    username: config.clientId,
    password: config.clientSecret,
    type: 'application/x-www-form-urlencoded',
  });

  const storeToken = response => {
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

  const authRequest = data => {
    if (authRequestPending) {
      return authRequestPending;
    }

    authRequestPending = csAuth.create('token', { data })
      .then(response => storeToken(response))
      .then(response => {
        authRequestPending = null;

        return response;
      });

    return authRequestPending;
  };

  const login = () => authRequest({
    grant_type: 'password',
    username: config.username,
    password: config.password,
  });

  const refresh = () => authRequest({
    grant_type: 'refresh_token',
    refresh_token: auth.refreshToken,
  });

  const logout = () =>
    new Promise(resolve => {
      // Currently this does not need to be async, but it might in the future.
      // For now just force async with setTimeout.

      setTimeout(() => {
        delete config.username;
        delete config.password;

        auth = {};
        authStore.clear();

        resolve();
      });
    });

  const tokenizeRequest = requestConfig =>
    Object.assign({}, requestConfig, { token: auth.accessToken });

  const tokenized = operation => (resource, requestConfig) =>
    cs[operation](resource, tokenizeRequest(requestConfig))
      .catch(error => {
        if (error.response.status === 401 && auth.refreshToken) {
          // Refresh the access token and retry.

          return refresh()
            .then(() => cs[operation](resource, tokenizeRequest(requestConfig)));
        }

        return Promise.reject(error);
      });

  return {
    login,
    logout,

    config() {
      return config;
    },

    create: tokenized('create'),
    read: tokenized('read'),
    update: tokenized('update'),
    delete: tokenized('delete'),
  };
}
