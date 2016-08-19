const express = require('express');
const cspaceServerMiddleware = require('./cspaceServerMiddleware');

/**
 * Port number to listen on. This should be the same as the port used by Karma.
 */
const port = 9876;

/**
 * Starts an Express server to stub the CSpace services layer.
 */
express().use(cspaceServerMiddleware).listen(port);
