const express = require('express');
const basicAuth = require('express-basic-auth');
const soap = require('soap');
const http = require('http');
const fs = require('fs');
const Cliente = require('./models/User');
const port = 8000;

const app = express();

const users = {
  'admin': '123'
};

var myService = {
  MyService: {
    MyPort: {
      getUsers: async function(args, callback, headers) {
        if (!headers || !headers.authentication || !headers.authentication.username || !headers.authentication.password) {
          return callback({
            faultcode: 'SOAP-ENV:Server',
            faultstring: 'Missing authentication credentials',
          });
        }

        if (headers.authentication.username !== 'admin' || headers.authentication.password !== '123') {
          return callback({
            faultcode: 'SOAP-ENV:Server',
            faultstring: 'Invalid username or password',
          });
        }

        try {
          const usuarios = await Cliente.findAll();
          const userList = usuarios.map(user => ({
            CODIGO: user.CODIGO,
            COD_FUNCIONARIO: user.COD_FUNCIONARIO,
            NOME: user.NOME,
            SENHA: user.SENHA
          }));

          callback({ users: { user: userList } });
        } catch (error) {
          console.error('Erro ao listar usuários:', error);
          callback({ users: [] }); 
        }
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

soap.listen(server, '/soap', myService, xml);

server.listen(port, () => {
  console.log(`SOAP server is running at http://localhost:${port}`);
});