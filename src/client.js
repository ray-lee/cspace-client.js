import session from './session';

const defaultClientConfig = {
  clientId: 'cspace-ui',
  clientSecret: '',
};

export default function client(clientConfig) {
  const config = Object.assign({}, defaultClientConfig, clientConfig);

  return {
    config() {
      const configCopy = Object.assign({}, config);
      
      delete configCopy.clientSecret;

      return configCopy;
    },

    session(sessionConfig) {
      return session(Object.assign({}, sessionConfig, config));
    },
  };
}
