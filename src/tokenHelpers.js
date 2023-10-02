/* global window */

export const storageKey = 'cspace-client';

const base64Decode = (encoded) => {
  if (typeof window !== 'undefined') {
    // We're in a browser.

    return window.atob(encoded)
      .split('')
      // eslint-disable-next-line prefer-template
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');
  }

  // We're in Node.

  return Buffer.from(encoded, 'base64').toString('utf-8');
};

export const parseJwt = (token) => {
  const urlSafeBase64 = token.split('.')[1];
  const base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(base64Decode(base64));

  return JSON.parse(json);
};
