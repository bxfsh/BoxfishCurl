var curl = require('../index');

curl.get('http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139').then(function(data) {
  console.log(data);
}, function(error) {
  console.log(console.error);
});
