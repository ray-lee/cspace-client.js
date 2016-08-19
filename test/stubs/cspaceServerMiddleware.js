const sendJson = require('send-data/json');

/**
 * Delay in ms to be added to token grant requests.
 */
const delay = 500;

/**
 * Counter to ensure uniqueness of tokens on each grant.
 */
let tokenNum = 0;

/**
 * An Express middleware function that stubs the CSpace services layer.
 *
 * Tests in this package require this middleware to be accessible on a local port, in order to
 * simulate REST API calls.
 *
 * When running browser tests through Karma, this middleware may be added to the Karma server by
 * configuring it as a middleware plugin in karma.conf.js. This makes it accessible on the same
 * port as Karma.
 *
 * Alternatively, a trivial standalone Express server that includes this middleware is implemented
 * in cspaceServer.js. That server should be started before running tests that do not use Karma,
 * for example by adding it to the npm test script in package.json.
 */
module.exports = function cspaceServerMiddleware(req, res, next) {
  if (req.method === 'POST' && req.url === '/cspace-services/oauth/token') {
    // On any POST to the /oauth/token endpoint, return a new set of tokens (after a delay). This
    // simulates a successful OAuth2 password credentials grant or refresh token grant.

    setTimeout(() => {
      sendJson(req, res, {
        statusCode: 200,
        body: {
          access_token: `access_${tokenNum}`,
          refresh_token: `refresh_${tokenNum}`,
        },
      });

      tokenNum += 1;
    }, delay);
  } else if (req.url.startsWith('/cspace-services/reject/')) {
    // On any request to the /reject/${token} endpoint, return 401 if the token specified in the
    // URL matches the bearer token supplied in the Authorization header. This simulates an
    // expired or otherwise invalidated token being used to request a resource.

    // The expected behavior is for the client to renew the token and retry the request. On the
    // second attempt, the new token supplied in the Authorization header will no longer match the
    // token in the URL, so the request will succeed. This simulates a successful retry after
    // renewal.

    const invalidToken = req.url.substring('/cspace-services/reject/'.length);
    const presentedToken = req.headers.authorization.substring('Bearer '.length);
    const statusCode = (invalidToken === presentedToken) ? 401 : 200;

    sendJson(req, res, {
      statusCode,
      body: {
        invalidToken,
        presentedToken,
      },
    });
  } else if (req.url.startsWith('/cspace-services/')) {
    // On any other request, return the bearer token that was supplied in the Authorization header.
    // This may be used by a test to verify the expected token was sent.

    sendJson(req, res, {
      statusCode: 200,
      body: {
        presentedToken: req.headers.authorization.substring('Bearer '.length),
      },
    });
  } else {
    // Not a cspace-services request. Forward it to the next middleware.

    next();
  }
};
