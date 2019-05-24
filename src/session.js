/* global window */

import cspace from 'cspace-api';
import urljoin from 'url-join';
import tokenStore from './tokenStore';

const defaultSessionConfig = {
  username: '',
  password: '',
};

const base64Encode = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return value;
  }

  if (typeof window !== 'undefined') {
    return window.btoa(value);
  }

  return new Buffer(value).toString('base64');
};

export default function session(sessionConfig) {
  const config = Object.assign({}, defaultSessionConfig, sessionConfig);
  const authStore = tokenStore(config.clientId, config.url);

  let authRequestPending = null;
  let auth = authStore.fetch() || {};

  if (config.username) {
    // The username for this session was specified, and differs from the stored auth user.
    // Don't use the stored auth.

    if (config.username !== auth.username) {
      auth = {};
    }
  } else if (auth.username) {
    // The username for this session was not specified. Use the stored auth user, if one exists.

    config.username = auth.username;
  }

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
      username: config.username,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };

    authStore.store(auth);

    // We have tokens, so the user password can be discarded.

    delete config.password;

    return response;
  };

  const authRequest = (data) => {
    if (authRequestPending) {
      return authRequestPending;
    }

    authRequestPending = csAuth.create('token', { data })
      .then(response => storeToken(response))
      .then((response) => {
        authRequestPending = null;

        return response;
      });

    return authRequestPending;
  };

  const login = () => authRequest({
    grant_type: 'password',
    username: config.username,
    password: base64Encode(config.password),
  });

  const refresh = () => authRequest({
    grant_type: 'refresh_token',
    refresh_token: auth.refreshToken,
  });

  const logout = () =>
    new Promise((resolve) => {
      // Log out may in the future require an async call to the REST API (for example, to revoke
      // tokens immediately). Currently it's a client-side only operation that can be done
      // synchronously, but to be consistent with a future async operation, we'll simulate it with
      // setTimeout.

      setTimeout(() => {
        delete config.username;
        delete config.password;

        auth = {};
        authStore.clear();

        resolve({});
      });
    });

  const tokenizeRequest = (requestConfig) => {
    if (requestConfig && requestConfig.auth === false) {
      return requestConfig;
    }

    return Object.assign({}, requestConfig, { token: auth.accessToken });
  };

  const tokenized = operation => (resource, requestConfig) =>
    cs[operation](resource, tokenizeRequest(requestConfig))
      .catch((error) => {
        if (error.response && error.response.status === 401 && auth.refreshToken) {
          // Refresh the access token and retry.

          return refresh()
            .then(() => cs[operation](resource, tokenizeRequest(requestConfig)));
        }

        return Promise.reject(error);
      })
      .catch((error) => {
        // Invoke the configured error handler, if any.

        if (config.onError) {
          return config.onError(error);
        }

        return Promise.reject(error);
      });

  return {
    config() {
      const configCopy = Object.assign({}, config);

      delete configCopy.clientSecret;
      delete configCopy.password;

      return configCopy;
    },
    login,
    logout,
    create: tokenized('create'),
    read: tokenized('read'),
    update: tokenized('update'),
    delete: tokenized('delete'),
  };
}
