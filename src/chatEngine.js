const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync(path.join(__dirname, 'protos/chat.proto'), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

//get client instance
function getChat({username, ip, port, onData = console.log}) {
  //console.log('chat ending join', ip, port);
  if (!username) throw Error('No username');
  if (!ip) throw Error('No IP');
  if (!port) throw Error('No port');
  const client = new proto.chat.Chat(`${ip}:${port}`, grpc.credentials.createInsecure());
  const channel = client.join({ user: username });
  channel.on('data', onData);
  client.mySend = (text) => client.send({ user: username, text: text, date: new Date(Date.now()).toISOString() }, res => {});
  return client;
}

//start server
function startServer({username, ip, port, log = console.log} = {}) {
  const users = [];
  if (!username) throw Error('No username');
  if (!ip) throw Error('No IP');
  if (!port) throw Error('No port');
  function join(call, callback) {
    users.push(call);
    notifyChat({ user: 'server', text: 'new user joined', date: new Date(Date.now()).toISOString() });
  }
  //Receive message from client
  function send(call, callback) {
    notifyChat(call.request);
  }
  //Send message to all connected clients
  function notifyChat(message) {
    users.forEach(user => {
      user.write(message);
    });
  }
  const server = new grpc.Server();
  //Define server with the methods and start it
  server.addService(proto.chat.Chat.service, { join: join, send: send });
  server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure());
  server.start();
  log('Server started');
  //console.log('Server started');
  return server;
}

module.exports = { getChat, startServer };
