const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Disable node integration for security reasons
      nodeIntegration: false, 
      contextIsolation: true, 
      preload: path.join(__dirname, 'preload.js') // Reference preload.js here
    }
  });

  // Load your index.html from the dist folder
  mainWindow.loadFile(path.join(__dirname, 'dist-react', 'index.html'));

  // Open DevTools (optional)
  // mainWindow.webContents.openDevTools();

  // When the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Called when Electron is ready
app.whenReady().then(createWindow);

// Quit the app when all windows are closed (for macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create the window if the app is re-activated (for macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
