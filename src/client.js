import session from './session';

const defaultClientConfig = {
  clientId: 'cspace-ui',
  clientSecret: '',
};

export default function client(clientConfig) {
  const config = Object.assign({}, defaultClientConfig, clientConfig);

  return {
    config() {
      return config;
    },

    session(sessionConfig) {
      return session(Object.assign({}, sessionConfig, config));
    },
  };
}
