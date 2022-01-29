const path = require('path');
const protoLoader = jest.createMockFromModule('@grpc/proto-loader');

function loadSync(...args) {
  console.log('[*] proto loading called');
}

protoLoader.loadSync = loadSync;

module.exports = protoLoader;
