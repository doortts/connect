
/*!
 * Connect - static
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var send = require('send')
  , utils = require('../utils')
  , parse = utils.parseUrl
  , url = require('url');

/**
 * Static:
 *
 *   Static file server with the given `root` path.
 *
 * Examples:
 *
 *     var oneDay = 86400000;
 *
 *     connect()
 *       .use(connect.static(__dirname + '/public'))
 *
 *     connect()
 *       .use(connect.static(__dirname + '/public', { maxAge: oneDay }))
 *
 * Options:
 *
 *    - `maxAge`     Browser cache maxAge in milliseconds. defaults to 0
 *    - `hidden`     Allow transfer of hidden files. defaults to false
 *    - `redirect`   Redirect to trailing "/" when the pathname is a dir. defaults to true
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function static(root, options){
  options = options || {};

  // root required
  if (!root) throw new Error('static() root path required');
  options.root = root;

  // default redirect
  var redirect = false === options.redirect ? false : true;

  return function static(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();
    var path = parse(req).pathname;

    function directory() {
      if (!redirect) return next();
      var pathname = url.parse(req.originalUrl).pathname;
      res.statusCode = 301;
      res.setHeader('Location', pathname + '/');
      res.end('Redirecting to ' + utils.escape(pathname) + '/');
    }

    send(req, path)
      .maxage(options.maxAge || 0)
      .root(options.root)
      .hidden(options.hidden)
      .on('error', next)
      .on('directory', directory)
      .pipe(res);
  };
};

/**
 * Expose mime module.
 * 
 * If you wish to extend the mime table use this
 * reference to the "mime" module in the npm registry.
 */

exports.mime = send.mime;
