# BoxfishCurl.js

## Installation

npm install boxfishcurl

## Usage

| Param         | type |  Required      | Default  |
| ------------- |-----:| --------------:|-----:|
| host          | string | true | - |
| path          | string | true | - |
| port          | string | | 80 |
| method        | string | | 'GET'|
| headers       | object | | -
| data          | string | | 'application/x-www-form-urlencoded'


``` javascript
curl.req({
	    host    : 'boxfish.com',
	    path    : '/', 
	    headers : { 'Content-Type': 'application/json' },
	    method  : 'POST',
	    data    : {
	        field       : 'this can be any JSON',
	        used        : 'this will be sent in the request body',
	        required    : false
	    }
	  }).then(function(response) {
	    // you got your data back
	  }, function(err) {
	    // something went wrong
	  });	
```

## Run test

```
npm test
```
