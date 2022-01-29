const path = require('path');
const grpc = jest.createMockFromModule('grpc');

// A custom version of `Server` 
function Server() {
  this.addService = (...args) => console.log('[*] addServer was called with args: ', ...args);
  this.bind = (...args) => console.log('[*] bind was called with args: ', ...args);
  this.start = (...args) => console.log('[*] addServer was called with args: ', ...args);
}

function loadPackageDefinition(...args) {
  const proto = {
    chat: {
      Chat: function(...args) {
        this.join = (...args) => {
          console.log('[*] join was called');
          return { on(...args) { console.log('[*] channel on was called') }};
        }
        this.send = (...args) => {
          console.log('[*] send was called');
        }
      },
    }
  }
  proto.chat.Chat.service = {};
  return proto;
}

grpc.Server = Server;
grpc.loadPackageDefinition = loadPackageDefinition;

module.exports = grpc;
