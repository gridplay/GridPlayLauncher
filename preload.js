const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
    // Expose necessary APIs or functionality to the renderer process
});
