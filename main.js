const {  BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const app = require('electron').app;

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});
let mainWindow;

function createWindow () {
  console.log('window ready');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    console.log('ready-to-show');
    autoUpdater.checkForUpdatesAndNotify();
  });

}

app.on('ready', () => {
  createWindow();
});
 
  

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  console.log('update-available'); 
});
autoUpdater.on('update-downloaded', () => {
  console.log('update-downloaded'); 
});

// autoUpdater.on("checking-for-update", () => {
//   console.log('checking-for-update'); 
// });
 
// autoUpdater.on("update-not-available", () => {
//   console.log('update-not-available');
// });

// autoUpdater.on('update-available', () => {
//   console.log('update-available');
//   mainWindow.webContents.send('update_available');
// });


// autoUpdater.on('update-downloaded', () => {
//   console.log('update-downloaded');
//   mainWindow.webContents.send('update_downloaded');
// });

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
