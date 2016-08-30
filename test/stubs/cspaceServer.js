const express = require('express');
const bodyParser = require('body-parser');
const cspaceServerMiddleware = require('./cspaceServerMiddleware');

/**
 * Port number to listen on. This should be the same as the port used by Karma, so that tests can
 * run against this server or a Karma server without any changes.
 */
const port = 9876;

/**
 * Starts an Express server to stub the CSpace services layer.
 */
express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cspaceServerMiddleware)
  .listen(port);
