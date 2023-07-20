const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    // Do something after the window finishes loading if needed.
  });

  ipcMain.on('botao-clique', (event, host, port) => {
    // Call the makeRequest function and pass the event.sender to send the response back
    makeRequest(event.sender, host, port);
  });
});

function makeRequest(sender, host, port) {
  const client = new net.Socket();

  client.connect(port, host, () => {
    console.log('Conexão estabelecida');
    client.write('Hello, server!'); // Escrever dados no socket, se necessário
  });

  client.on('data', (data) => {
    console.log('Dados recebidos do servidor:', data.toString());
    client.end(); // Fechar a conexão após receber os dados, se necessário

    // Send the response back to the renderer process
    sender.send('response', data.toString());
  });

  client.on('close', () => {
    console.log('Conexão fechada');
  });

  client.on('error', (err) => {
    console.error('Erro na conexão:', err.message);
    // Send the error back to the renderer process (if needed)
    sender.send('response', { error: err.message });
  });
}
