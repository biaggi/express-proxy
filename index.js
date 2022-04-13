var http = require('http'),
  httpProxy = require('http-proxy'),
  fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = false;
const domain = process.argv[2];
const port = process.argv[3];
if (!domain || ! port ) {
  console.log("use: ");
  console.log("To set up authorization proxy");
  console.log("node index.js https://github.com/ 5050");
  console.log("To set up resources proxy");
  console.log("node index.js https://api.github.com/ 5051 ");
  process.exit(1);
}
//
// Create your proxy server and set the target in the options.
//
var options = {
  changeOrigin: true,
  target: {
    https: true
  }
}
var proxy = httpProxy.createProxyServer(options); // See (†)
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  res.setHeader( 'Access-Control-Allow-Origin', '*');
});


var server = http.createServer(function (req, res) {

  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, { target: domain });
});

console.log("listening on port " + port)
server.listen(port);
