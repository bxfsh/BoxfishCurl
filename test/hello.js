var curl = require('../index');

curl.get('http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139')
  .then(function(response) {
    console.log('response from weather api');
    return curl.get('http://boxfish.com');
  }).then(function(data) {
    console.log('response from boxfish.com');
  });
