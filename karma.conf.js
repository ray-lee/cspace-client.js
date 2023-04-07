/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-console: "off" */

const bodyParser = require('body-parser');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const webpack = require('webpack');
const cspaceServerMiddleware = require('./test/stubs/cspaceServerMiddleware');

const TEST_BACKEND = 'https://core.dev.collectionspace.org';

const getTestFiles = (config) => {
  if (config.file) {
    return config.file.split(',');
  }

  const defaultTestDirs = [
    'test/specs',
    'test/integration',
  ];

  const testDirs = config.dir ? config.dir.split(',') : defaultTestDirs;

  return testDirs.map((dir) => `${dir}/**/*.+(js|jsx)`);
};

module.exports = function karma(config) {
  const localBrowsers = ['Chrome'];
  const githubBrowsers = ['Chrome', 'Firefox'];

  let browsers;

  if (process.env.GITHUB_ACTIONS) {
    // This is a CI run on GitHub.

    console.log('Running on GitHub.');

    browsers = githubBrowsers;
  } else {
    // This is a local run.

    console.log('Running locally.');

    const localBrowsersEnv = process.env.KARMA_BROWSERS;

    browsers = localBrowsersEnv ? localBrowsersEnv.split(',') : localBrowsers;
  }

  config.set({
    browsers,
    concurrency: 1,
    files: getTestFiles(config),

    frameworks: [
      'mocha',
      'chai',
      'webpack',
    ],

    reporters: [
      'mocha',
      'coverage',
    ],

    client: {
      mocha: {
        timeout: 4000,
      },
    },

    autoWatch: true,
    singleRun: config.singleRun === 'true',

    preprocessors: {
      'test/**/*.js': [
        'webpack',
        'sourcemap',
      ],
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            use: [
              {
                loader: 'babel-loader',
              },
            ],
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          // Set the back end server to use in integration tests to this local Karma server.
          // A middleware is installed to proxy cspace-services requests to the URL specified
          // by TEST_BACKEND.

          'globalThis.TEST_BACKEND': JSON.stringify('http://localhost:9876'),
        }),
      ],
    },

    port: 9876,
    colors: true,

    // Code will have been instrumented via Babel and babel-plugin-istanbul
    // when NODE_ENV is 'test' (see .babelrc).

    coverageReporter: {
      type: 'json',
      dir: `coverage/${process.env.npm_lifecycle_event}`,
    },

    // Add middleware to stub the cspace services layer.

    middleware: process.env.npm_lifecycle_event === 'test-browser-integration'
      ? ['proxy']
      : ['bodyParserMiddleware', 'cspaceServerMiddleware'],

    plugins: [
      ...config.plugins,

      {
        'middleware:bodyParserMiddleware': ['factory', function create() {
          return bodyParser.urlencoded({ extended: true });
        }],
      },
      {
        'middleware:cspaceServerMiddleware': ['factory', function create() {
          return cspaceServerMiddleware;
        }],
      },
      {
        // A middleware that proxies cspace-services requests to the URL specified by TEST_BACKEND.
        // This is used to avoid CORS issues when connecting to a CSpace server from an integration
        // test running in a browser.

        'middleware:proxy': ['factory', function create() {
          return createProxyMiddleware({
            target: TEST_BACKEND,
            pathFilter: '/cspace-services',
            changeOrigin: true,
            headers: {
              origin: TEST_BACKEND,
            },
            onProxyRes: (proxyRes) => {
              // Prevent the browser from showing the login prompt.
              // eslint-disable-next-line no-param-reassign
              delete proxyRes.headers['www-authenticate'];
            },
          });
        }],
      },
    ],
  });
};
