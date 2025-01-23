const soap = require('soap');
const http = require('http');
const fs = require('fs');

var myService = {
  MyService: {
    MyPort: {
      MyFunction: function(args) {
        return {
          status: 'Received: ' + args.testParam
        };
      },
      
      MyAsyncFunction: function(args, callback) {
        setTimeout(() => {
          callback({
            status: 'Received asynchronously: ' + args.testParam
          });
        }, 1000); 
      }
    }
  }
};

var xml = fs.readFileSync('myservice.wsdl', 'utf8');

var server = http.createServer(function(request, response) {
  if (request.url === '/') {
    response.writeHead(302, { 'Location': '/wsdl' });
    response.end();
  } else if (request.url === '/wsdl') {
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.end(xml);
  } else {
    response.end('404: Not Found: ' + request.url);
  }
});

server.listen(8000, () => {
  console.log('SOAP server is running at http://localhost:8000');
});

soap.listen(server, '/soap', myService, xml);
