var should = require('chai').should();
var assert = require('chai').assert;
var curl = require('../index');

describe('BoxfishCurl', function() {

	it('should ping boxfish.com', function() {
		curl.req({
	    host: 'boxfish.com',
	    path: '/',
	  }).then(function(data) {
	    data.should.be.a('string');
	  }, function(err) {
	    throw 'If this is broken, STOP WHAT YOU ARE DOING AND GO FIX THE WEBSITE' + err;
	  });
	});

	it('should get todays weather', function() {
		curl.req({
			host: 'api.openweathermap.org',
			path: '/data/2.5/weather?lat=35&lon=139',
			header: { 'Content-Type': 'application/json' }
		}).then(function(data) {
			expect(data).to.have.property('weather').with.length(1);
		}, function(err) {
			throw err;
		});
	});

  it('should get todays weather', function() {
		curl.get('http://google.com').then(function(data) {
      // console.log(data);
			// expect(data).to.have.property('weather').with.length(1);
		}, function(err) {
			throw err;
		});
	});

});
