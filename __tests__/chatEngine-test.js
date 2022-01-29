jest.mock('grpc');
jest.mock('@grpc/proto-loader');

describe('chat engine server', () => {
  beforeEach(() => {

  });
  test('throws with not enough args', () => {
    const chatEngine = require('../src/chatEngine');
    expect(() => chatEngine.startServer()).toThrow();
  });
  test('works with all args', () => {
    const chatEngine = require('../src/chatEngine');
    expect(() => chatEngine.startServer({ 
      username: 'test',
      ip: '0.0.0.0',
      port: '8888'
    })).not.toThrow();
  });
});


describe('chat engine client', () => {
  beforeEach(() => {

  });
  test('throws with not enough args', () => {
    const chatEngine = require('../src/chatEngine');
    expect(() => chatEngine.getChat()).toThrow();
  });
  test('works with all args', () => {
    const chatEngine = require('../src/chatEngine');
    expect(() => chatEngine.getChat({ 
      username: 'test',
      ip: '0.0.0.0',
      port: '8888'
    })).not.toThrow();
  });
});
