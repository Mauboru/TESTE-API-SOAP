const soap = require('soap');
const url = 'http://localhost:8000/wsdl'; 
const args = { testParam: 'Hello, World!' };

soap.createClient(url, function(err, client) {
  if (err) {
    console.error('Erro ao criar cliente SOAP:', err);
    return;
  }

  console.log('Cliente SOAP criado com sucesso!');
  
  client.MyFunction(args, function(err, result) {
    if (err) {
      console.error('Erro ao chamar o método MyFunction:', err);
      return;
    }
    console.log('Resultado do serviço SOAP:', result);
  });

  client.MyAsyncFunction(args, function(err, result) {
    if (err) {
      console.error('Erro ao chamar a função assíncrona:', err);
      return;
    }
    console.log('Resultado assíncrono do serviço SOAP:', result);
  });
});
