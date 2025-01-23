const soap = require('soap');
const http = require('http');
const fs = require('fs');
const Cliente = require('./models/User'); 

var myService = {
  MyService: {
    MyPort: {
      getUsers: async function(args, callback) {
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

server.listen(8000, () => {
  console.log('SOAP server is running at http://localhost:8000');
});

soap.listen(server, '/soap', myService, xml);
