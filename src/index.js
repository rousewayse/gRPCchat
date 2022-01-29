const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { getChat, startServer } = require('./chatEngine');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

//client object, used to send messages to chats
let client;

//start server
ipcMain.on('start', function (event, {username, ip = null, port = null}) {
  const server = startServer({
    username, ip, port,
    log: (msg) => event.reply('log', msg),
  });
});

//join to chat
ipcMain.on('join', function (event, { username, ip , port }) {
  //console.log('index join', username, ip, port);
  client = getChat({ 
    username, ip, port, 
    onData: (msg) => mainWindow.webContents.send('message', msg),
  });
});

//send message
ipcMain.on('send', function (event, msg) {
  if (client) {
    client.mySend(msg);
    event.reply('sent');
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
