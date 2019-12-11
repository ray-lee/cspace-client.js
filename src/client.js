import session from './session';

const defaultClientConfig = {
  clientId: 'cspace-ui',
  clientSecret: '',
};

export default function client(clientConfig) {
  const config = {
    ...defaultClientConfig,
    ...clientConfig,
  };

  return {
    config() {
      const configCopy = { ...config };

      delete configCopy.clientSecret;

      return configCopy;
    },

    session(sessionConfig) {
      return session({
        ...sessionConfig,
        ...config,
      });
    },
  };
}
