const { contextBridge } = require('electron');

// Expose Node.js features you want to use in the renderer process
contextBridge.exposeInMainWorld('electron', {
  doSomething: () => {
    console.log('This function is exposed from the main process.');
  }
});
