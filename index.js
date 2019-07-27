/**
 * Module dependencies.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const proxy = require('http-proxy-middleware');

const HTTP_SERVER_ERROR = 500;

const filter = function (pathname, req) {
  return (pathname.match('^/') && req.method !== 'OPTIONS');
};

const hostUrl = process.env.HOST;
const bindPort = process.env.PORT || 3000;
/**
 * Configure proxy middleware
 */
const jsonPlaceholderProxy = proxy(filter, {
  target: hostUrl,
  changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
  logLevel: 'debug',
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
});

const app = express();

/**
 * Add the proxy to express
 */
app.use(cors());
app.use('/', jsonPlaceholderProxy);
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || HTTP_SERVER_ERROR).render('500');
});
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', req.get('origin'))
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
//   res.header('Access-Control-Allow-Credentials', true)
//
//   if (req.method === 'OPTIONS') {
//   	res.send(200)
//   } else {
//     next()
//   }
// });

app.listen(bindPort);

console.log(`[DEMO] Server: listening on port ${bindPort}`);
console.log(`[DEMO] Opening: http://localhost:${bindPort}/`);

require('opn')(`http://localhost:${bindPort}/`);
