;(function(module) {

  'use strict';

  /**
   * dependencies
   */
  var promise 	  = require('promised-io/promise');
  var colors      = require('colors');
  var request     = require('request');
  var extend      = require('deep-extend');

  /**
   * Curl service
   * example call
   *
   * 		curl.req({
   *				host 	: 'ipinfo.io',
   *				path 	: '/',
   *				method	: 'GET'
   *			}, function(err, data) { // do stuff your data });
   *
   * @type {Object}
   */
  module.exports = {

    init: function init(options) {

      if (typeof options === 'undefined') options = {};

      var headers = options.headers || {};
      delete options.headers;

      // Merge the default options with the client submitted options
      this.options = extend({
        request_options: {
          headers: extend({
            'Accept': '*/*',
            'Connection': 'close',
            // 'User-Agent': 'node-twitter/' + VERSION
          }, headers)
        }
      }, options);

      // Build a request object
      this.request = request.defaults(this.options.request_options);
    },

    __request : function __request(method, path, params, callback) {

      if (!this.request) this.init();

      var base = 'rest';
      var stream = false;

      // Set the callback if no params are passed
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }

      // Set API base
      if (typeof params.base !== 'undefined') {
        base = params.base;
        delete params.base;
      }

      // Stream?
      if (base.match(/stream/)) {
        stream = true;
      }

      // Build the options to pass to our custom request object
      var options = {
        method: method.toLowerCase(),  // Request method - get || post
        url: path
      };

      // Pass url parameters if get
      if (method === 'get' || method === 'delete' ) {
        options.qs = params;
      }

      // Pass form data if post
      if (method === 'post' || method === 'put') {
        var formKey = 'form';

        if (typeof params.media !== 'undefined') {
          formKey = 'formData';
        }
        options[formKey] = params;
      }

      // console.log('Request options');
      // console.log(options);

      this.request(options, function(error, response, data){
        // console.log(error);
        // console.log(data);
        if (error) {
          callback(error, data, response);
        } else {

          try {
            data = JSON.parse(data);
          } catch(parseError) {
            callback(
              null,
              data,
              response
            );
          }

          console.log('status code from boxfishcurl', response.statusCode);

          if (typeof data.errors !== 'undefined') {
            callback(data.errors, data, response);
          }

          else if (response.statusCode !== 200 && response.statusCode !== 201) {
            callback(
              new Error('Status Code: ' + response.statusCode),
              data,
              response
            );
          } else {
            callback(null, data, response);
          }
        }

      });

    },

    /**
     * Get something
     * @param  {[type]} url    [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    __requestWithDeferred: function(method, url, params) {
      var deferred = promise.defer();
      var resolved = false;

      this.__request(method, url, params || {}, function(err, response, data) {

        if (resolved) return;

        if (typeof err !== 'undefined' && err !== null) {
          deferred.reject(err);
        } else {
          deferred.resolve(response);
        }

        resolved = true;

      });

      return deferred;
    },

    /**
     * GET
     * @param  {[type]} url    [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    get: function get(url, params) {
      return this.__requestWithDeferred('get', url, params);
    },

    /**
     * POST
     * @param  {[type]} url    [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    post: function post(url, params) {
      return this.__requestWithDeferred('post', url, params);
    },

    /**
     * PUT
     * @param  {[type]} url    [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    put: function put(url, params) {
      return this.__requestWithDeferred('put', url, params);
    },

    /**
     * DELETE
     * @param  {[type]} url    [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    delete: function(url, params) {
      return this.__requestWithDeferred('delete', url, params);
    },

  	/**
  	 * makes a curl request
  	 * @param  {[type]}   options  all configurations
  	 * @return {[type]}            the http request object
  	 */
  	req: function(options, formData) {

  		var retVal = '';
      var deferredResolved = false;
  		var https = require( options.ssh ? 'https' : 'http');
  		var o = {
        host: options.host,
        path: options.path,
        port: options.port || 80,
        method: options.method || 'GET',
        headers : options.headers || { }
      };
      var deferred = promise.defer();

      if (options.body) {
        o.body = options.body;
      }

      if (typeof o.headers['Content-Type'] === 'undefined') {
        o.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }

      if (options.data) {
        if (typeof options.data !== 'string') {
          options.data = JSON.stringify(options.data);
        }
        o.headers['Content-Length'] = options.data.length;
      }

      var req = https.request(o, function(res) {

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          // console.log(new Date(), 'on data', chunk);
          retVal += chunk;
        });

        res.on('end', function() {

        	var data = retVal;

        	try {
            if (retVal.length && retVal.length ===0) {
              // console.log('CURL: response is empty', res.req._header);
            } else if (typeof retVal === 'string') {
            	data = JSON.parse(retVal);
          	}
          } catch ( _ ) {
            // console.log('CURL: error while parsing data');
          }

          switch (res.statusCode) {
            case 500:
            case 400:
            case 404:
              console.log('Curl Error'.red);
              console.log('CURL: returned code', res.statusCode, 'from request', res.req._header);
              if (!deferredResolved) deferred.reject(data, data);
              deferredResolved = true;
              break;
            default:
              if (!deferredResolved) deferred.resolve(data, res);
              deferredResolved = true;
              break;
          }

        });

    	});

      if (options.timeout) {
        req.setTimeout(options.timeout, function() {
          if (!deferredResolved) deferred.reject('Request timeout');
          deferredResolved = true;
        });
      }

      if (options.form && options.form.pipe) {
        options.form.pipe(req);
      }

      req.on('response', function(res) {
        console.log(res.statusCode);
      });

      if (options.data) {
        o.headers['Content-Length'] = options.data.length;
        req.write(options.data);
      }

      req.on('error', function(e) {
        deferred.reject(null, 'problem with request: ' + e);
      }).end();

  	  return deferred;

  	}

  };

})(module); // jshint ignore:line
