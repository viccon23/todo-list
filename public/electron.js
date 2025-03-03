const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const { spawn } = require('child_process');
const ConfigManager = require(path.join(__dirname, '../server/configManager'));

// Define the server path
const serverPath = isDev 
  ? path.join(__dirname, '../server/server.js')
  : path.join(process.resourcesPath, 'server/server.js');

let mainWindow;
let serverProcess;
const configManager = new ConfigManager();

// Handle setup dialog
async function showSetupDialog() {
  return new Promise((resolve) => {
    let setupWindow = new BrowserWindow({
      width: 900,
      height: 700,
      parent: mainWindow,
      modal: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    setupWindow.loadFile(path.join(__dirname, 'setup.html'));
    setupWindow.once('ready-to-show', () => {
      setupWindow.show();
    });

    ipcMain.once('save-config', (event, config) => {
      configManager.setMongoUri(config.mongoUri);
      setupWindow.close();
      resolve(true);
    });

    setupWindow.on('closed', () => {
      setupWindow = null;
      resolve(false);
    });
  });
}

function startServer() {
  const mongoUri = configManager.getMongoUri();
  console.log('Starting server with MongoDB URI:', mongoUri);
  
  const env = Object.assign({}, process.env, {
    MONGODB_URI: mongoUri
  });
  
  try {
    console.log('Using server path:', serverPath);
    serverProcess = spawn('node', [serverPath], { env });
    
    // Add better error handling
    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      dialog.showErrorBox('Server Error', `Failed to start the server: ${error.message}`);
    });
    
    // Rest of your existing code
  } catch (error) {
    console.error('Error spawning server process:', error);
    dialog.showErrorBox('Server Error', `Could not spawn server process: ${error.message}`);
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'favicon.ico'),
    show: false // Hide until configured
  });

  // Check if app is configured
  if (!configManager.isConfigured()) {
    const configured = await showSetupDialog();
    if (!configured) {
      app.quit();
      return;
    }
  }
  
  // Start server with configuration
  startServer();

  // Show the window and load the app
  mainWindow.show();
  
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});