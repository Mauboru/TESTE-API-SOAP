const soap = require('soap');
const http = require('http');
const fs = require('fs');
const User = require('./models/User'); // Importando o modelo User para acessar os dados do banco

// Função para listar clientes
async function listarClientes() {
  try {
    const clientes = await User.findAll();
    return clientes.map(cliente => ({
      CODIGO: cliente.CODIGO,
      COD_FUNCIONARIO: cliente.COD_FUNCIONARIO,
      NOME: cliente.NOME,
      SENHA: cliente.SENHA, // Embora sensível, estamos retornando a senha (ajuste conforme necessidade)
    }));
  } catch (error) {
    throw new Error('Erro ao buscar clientes: ' + error.message);
  }
}

var myService = {
  MyService: {
    MyPort: {
      ListarClientes: async function(args) {
        try {
          const clientes = await listarClientes();
          return {
            clientes: clientes, 
          };
        } catch (error) {
          return {
            status: 'Erro ao listar clientes: ' + error.message,
          };
        }
      },
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
