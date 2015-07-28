# BoxfishCurl.js

## Installation

npm install boxfishcurl

## Using simple Request
###Usage
```javascript
// GET
curl.get('http://google.com').then([Function], [Function]);
```
```javascript
// POST
curl.post('http://your-post-url', params).then([Function], [Function]);
```
```javascript
// PUT
curl.put('http://your-PUT-url', params).then([Function], [Function]);
```
```javascript
// DELETE
curl.delete('http://your-DELETE-url', params).then([Function], [Function]);
```
### default properties
you can set any request options here, including any header you may need.

``` javascript
curl.init({ headers: { 'Content-Type' : 'application/json' } });
```
## Using HTTP and HTTPS modules
###Usage
| Param         | type |  Required      | Default  |
| ------------- |-----:| --------------:|-----:|
| host          | string | true | - |
| path          | string | true | - |
| port          | string | | 80 |
| method        | string | | 'GET'|
| headers       | object | | -
| data          | string | | 'application/x-www-form-urlencoded'


``` javascript
curl
	.req({
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
