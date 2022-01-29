const ipcRenderer = require('electron').ipcRenderer;

const get = (id) => document.getElementById(id);

const createLog = (msg) => {
  const div = document.createElement('DIV');
  div.className = 'log';
  div.textContent = msg;
  return div;
};

const createMessage = ({user, text, date}) => {
  const div = document.createElement('DIV');
  div.className = 'msg';
  div.textContent = `[${date}] ${user}: ${text}`;
  return div;
};

ipcRenderer.on('ok', (evt, msg) => {
  alert(msg);
})

ipcRenderer.on('erorr', (evt, msg) => {
  alert(msg);
})

ipcRenderer.on('sent', (evt, msg) => {
  get('messageInput').value = '';
})

ipcRenderer.on('message', (evt, msg) => {
  get('chatWindow').appendChild(createMessage(msg));
}) 

ipcRenderer.on('log', (evt, msg) => {
  console.log(msg);
  get('chatWindow').appendChild(createLog(msg));
})

get('start').onclick = (evt) => {
  const username = get('username').value;
  const port = get('port').value;
  const ip = get('ip').value;
  get('username').disabled = true;
  get('port').disabled = true;
  get('ip').disabled = true;
  get('start').disabled = true;
  //alert(username + ' ' + port + ' ' + ip);
  get('lock').style.display = 'none';
  get('chat').style.display = 'flex';
  const mode = ip && ip.length > 0 ? 'server' : 'client';
  get('chatHeader').textContent = `Mode is: ${mode}`;
  if (mode == 'server') {
    const resPort = port && port.length > 0 ? parseInt(port) : 8888;
    get('joinChat').value = `${'127.0.0.1'}:${resPort}`;
    ipcRenderer.send('start', { username, port: resPort, ip });
  }
}

get('join').onclick = (evt) => {
  const username = get('username').value;
  const [ip, port] = get('joinChat').value.split(':');
  ipcRenderer.send('join', { username, port , ip });
}


get('send').onclick = (evt) => {
  ipcRenderer.send('send', get('messageInput').value);
}
