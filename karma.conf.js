/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-console: "off" */

const bodyParser = require('body-parser');
const path = require('path');
const cspaceServerMiddleware = require('./test/stubs/cspaceServerMiddleware');

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
  // This is a local run.
  const localBrowsers = ['Chrome'];

  console.log('Running locally.');

  const browsers = localBrowsers;

  config.set({
    browsers,
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
    },

    port: 9876,
    colors: true,

    // Code will have been instrumented via Babel and babel-plugin-istanbul
    // when NODE_ENV is 'test' (see .babelrc).

    coverageReporter: {
      type: 'json',
      dir: 'coverage/',
    },

    // Add middleware to stub the cspace services layer.

    middleware: [
      'bodyParserMiddleware',
      'cspaceServerMiddleware',
    ],

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
    ],
  });
};
