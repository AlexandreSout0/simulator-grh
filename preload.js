window.electron = require('electron');
const { contextBridge, ipcRenderer } = require('electron');

// Expose makeRequest function to the renderer process
contextBridge.exposeInMainWorld('electron', {
  makeRequest: (host, port) => {
    ipcRenderer.send('botao-clique', host, port);
  },
  // Handle the 'response' event from the main process and pass it to the renderer process
  handleResponse: (callback) => {
    ipcRenderer.on('response', (event, data) => {
      callback(data);
    });
  },
});
