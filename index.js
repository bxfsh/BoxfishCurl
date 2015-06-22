;(function(module) {

  'use strict';

  /**
   * dependencies
   */  
  var promise 	  = require('promised-io/promise');
  var colors      = require('colors');

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

  	/**
  	 * makes a curl request
  	 * @param  {[type]}   options  all configurations
  	 * @return {[type]}            the http request object
  	 */
  	req: function(options) {

  		var retVal = '';
  		var https = require( options.ssh ? 'https' : 'http');
  		var o = {
        host: options.host,
        path: options.path,
        port: options.port || 80,
        method: options.method || 'GET',
        headers : options.headers || { }
      };
      var deferred = promise.defer();
      console.log('curl options', o);
      
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
              console.log(data);
              console.log('CURL: returned code', res.statusCode, 'from request', res.req._header);
              deferred.reject(data, data);
              break;
            default:
              deferred.resolve(data, res);
              break;
          }

        });

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