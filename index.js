const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const net = require('net');
const { Console } = require('console');
const client = new net.Socket();

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    resizable: false,
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

  ipcMain.on('chamarFuncaoPrincipal', (event, arg) => {
    // Call the makeRequest function and pass the event.sender to send the response back
    const functionName = arg.functionName;
    let arguments = arg.arguments; // Array com os argumentos
    //connectionRequest(event.sender, host, port);

    switch (functionName) {
        case 'connectServer':
            connectServer(arguments)
          break;
        case 'disconnectServer':
            disconnectServer()
          break;
        case 'sendMessage':
            sendMessage(arguments)
        break;
        // Adicione mais casos para outras funções, se necessário
        default:
          console.log(`Função "${functionName}" não encontrada.`);
      }


  });


});
function convertBinaryToSigned14Bits(binary) {
  // Verifica se o número binário possui 14 bits e completa com zeros à esquerda, se necessário
  if (binary.length < 14) {
    binary = binary.padStart(14, '0');
  } else if (binary.length > 14) {
    console.log("O número binário deve conter exatamente 14 bits.");
    return null;
  }

  // Verifica o bit mais significativo (MSB) para determinar o sinal
  const sign = binary[0] === '1' ? -1 : 1;

  // Converte os 13 bits restantes em um número decimal (base 10)
  const decimalValue = parseInt(binary.slice(1), 2);

  // Multiplica pelo sinal para obter o valor final
  const finalValue = sign * decimalValue;

  return finalValue;
}


function dec2Bin(decimal) {
  let binario = decimal.toString(2);
  binario = binario.padStart(15, '0');
  binario = binario.slice(-16);
  return binario;
}

function bin2Hex(binario) {
  const decimal = parseInt(binario, 2);
  const hexadecimal = decimal.toString(16).toUpperCase();
  return hexadecimal;
}

function connectServer(arguments) {
    let host = '200.219.213.241';//arguments[1];
    let port = 60440;//arguments[0];

    client.connect(port,host, () => {
        console.log('Conexão estabelecida');
        //client.write('Hello, server!'); // Escrever dados no socket, se necessário
      });
    
    //   client.on('data', (data) => {
    //     console.log('Dados recebidos do servidor:', data.toString());
    //     // Send the response back to the renderer process
    //     sender.send('response', data.toString());
    //   });
    
    //   client.on('error', (err) => {
    //     console.error('Erro na conexão:', err.message);
    //     // Send the error back to the renderer process (if needed)
    //     sender.send('response', { error: err.message });
    //   });
  }
  
function disconnectServer() {
    client.end();
    console.log('Conexão encerrada!');
}

function sendMessage(arguments){
  const menssage = arguments;
  console.log(menssage);
    client.write(menssage);
}



//200.219.213.241


function connectionRequest(sender, host, port) {

  client.connect(port, host, () => {
    console.log('Conexão estabelecida');
    //client.write('Hello, server!'); // Escrever dados no socket, se necessário
  });

//   client.on('data', (data) => {
//     console.log('Dados recebidos do servidor:', data.toString());
//     // Send the response back to the renderer process
//     sender.send('response', data.toString());
//   });

  client.on('error', (err) => {
    console.error('Erro na conexão:', err.message);
    // Send the error back to the renderer process (if needed)
    sender.send('response', { error: err.message });
  });


  client.on('close', () => {
    client.end();
  });
}