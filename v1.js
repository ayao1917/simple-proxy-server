/**
 * Module dependencies.
 */
const express = require('express');
const proxy = require('http-proxy-middleware');

const filter = function (pathname, req) {
  return (pathname.match('^/v1') && req.method !== 'OPTIONS');
};
/**
 * Configure proxy middleware
 */
const jsonPlaceholderProxy = proxy(filter, {
  target: 'https://staging-partner.emq.com',
  changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
  logLevel: 'debug'
});

const app = express();

/**
 * Add the proxy to express
 */
app.use('/v1', jsonPlaceholderProxy);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('origin'));
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.listen(3000);

console.log('[DEMO] Server: listening on port 3000');
console.log('[DEMO] Opening: http://localhost:3000/v1');

require('opn')('http://localhost:3000/v1');
