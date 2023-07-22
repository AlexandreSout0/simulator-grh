let intervalId;
let running = false;
let seconds = 0;
let minutes = 0;
let hours = 0;

const dataHoraAtual = new Date();
const dia = dataHoraAtual.getDate(); // Dia do mês (1-31)
const mes = (dataHoraAtual.getMonth() + 1).toString().padStart(2, '0');
const ano = dataHoraAtual.getFullYear().toString().slice(-2);
const hora = dataHoraAtual.getHours(); // Hora (0-23)
const minutos = dataHoraAtual.getMinutes(); // Minutos (0-59)
const segundos = dataHoraAtual.getSeconds(); // Segundos (0-59)

//console.log(`${dia}${mes}${ano} ${hora}${minutos}${segundos}`);




function decimal2Bin(decimal) {
    // Converte o número decimal para binário utilizando o método toString()
    let binario = decimal.toString(2);
  
    // Adiciona zeros à esquerda, caso o número binário tenha menos de 8 dígitos (opcional)
    binario = binario.padStart(8, '0');
    binario = binario.slice(-8);

    return binario;
  }

 function binario2Hex(binario) {
    // Converte o número binário para decimal utilizando parseInt()
    const decimal = parseInt(binario, 2);
  
    // Converte o número decimal para hexadecimal utilizando toString()
    const hexadecimal = decimal.toString(16).toUpperCase();
  
    return hexadecimal;
  }

function checksum(data) {
    let result = '';
    let csum = data.charCodeAt(0) ^ data.charCodeAt(1);
    
    for (let i = 2; i < data.length; i++) {
      csum = csum ^ data.charCodeAt(i);
    }
  
    result = data + csum.toString(16).toUpperCase() + '\n\r';
    return result;
  }

  function packageMount(){
    //KIJO95,00,114,V1,235238,010523,8125,-87,-5,11,34,000100,61
    const checkboxElementFrameCode = document.getElementById('frameCode');
    const isChecked = checkboxElementFrameCode.checked;

    const headerPack = 'KIJO95,00';
    var fleet = document.getElementById("frota").value;
    const version = 'V1'
    const time =`${hora}${minutos}${segundos}`;
    const data =`${dia}${mes}${ano}`;
    const fleetRecetor = '8125';
    const rssi = '-50';
    const snr = '-5';
    const frameId = '201'
    var frameCode = '';

    if (isChecked) {
        frameCode = '11'; //alive
        const payload = 'CA' + '0000';
        var package = headerPack + ',' + fleet + ',' + version + ',' + time + ',' + data + ',' + fleetRecetor + ',' + rssi + ',' + snr + ',' + frameCode + ',' + frameId + ',' + payload + ',';
        package = checksum(package);

    }else{
        frameCode = '10'; // irrigação
        if(running == true || minutes < 1) {
            const payload = 'CA' + '0000';
            var package = headerPack + ',' + fleet + ',' + version + ',' + time + ',' + data + ',' + fleetRecetor + ',' + rssi + ',' + snr + ',' + frameCode + ',' + frameId + ',' + payload + ',';
            package = checksum(package);
        }
        
        var tempo = 106; // 01101010 em binario 
        var byte1 = (tempo >> 1); // Shift direita por 1 bit --> 11010100 em binario
        var byte2 = (tempo << 7); // Shift esquerda por 7 bits --> 00000000 00000000 in binary
        // concatenar os dois bytes
        var result = parseInt(2).byte1 + parseInt(2).byte2;  // 1101010000000000 in binary
        // convertendo em hexa
        //var resultHex = result.toString(16); //D400 em hexadecimal, resultado esperado
        const payload = result;
        var package = headerPack + ',' + fleet + ',' + version + ',' + time + ',' + data + ',' + fleetRecetor + ',' + rssi + ',' + snr + ',' + frameCode + ',' + frameId + ',' + payload + ',';
        package = checksum(package);    


        // var byte1 = (tempoIrrigacao >> 1);
        //var byte2 = (tempoIrrigacao << 7);
        // var byte1 = (tempoIrrigacao >> 8) & 0xFF;
        // var byte2 = tempoIrrigacao & 0xFF;
        // var resultado = (byte1 << 8) | byte2;
        // console.log(resultado.);
        //byte1 = byte1 << 1;
        // var byte2 = (tempoIrrigacao << 7); //| (tempoIrrigacao >> 1);
        //tempoIrrigacao = decimal2Bin(tempoIrrigacao);
        // const valorDoPrimeiroBit = (tempoIrrigacao & mascara) === mascara;
        // const mascara3 = 0b01111111; // 0x7F em hexadecimal
        // const numeroSemPrimeiroBit = tempoIrrigacaobinario & mascara3;
        // const numeroCompletadoComZeros = numeroSemPrimeiroBit.toString(2).padStart(8, '0');
        // const numero1Deslocado = numeroCompletadoComZeros << 8;
        // const numeroConcatenado = numero1Deslocado | mascara2;
        // if (valorDoPrimeiroBit == 1){
        //     const numeroConcatenado = numero1Deslocado | mascara2;
        // }
        //const payload = (tempoIrrigacao & 0x7F).toString(16);
        //const alx = tempo.toString(16);


    }
    
    //KIJO95,00,1004020402,V1,195325,200723,42102,-93,3,10,10,C9D400,4B

    
    const payload = ''; //CE0000
    const FrameCode = '11';

    

    document.getElementById('trama').textContent = package;

  }



function updateTimer() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
            minutes = 0;
            hours++;
        }
    }

    const displayHours = hours.toString().padStart(2, '0');
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');

    document.getElementById('timer').textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
}

function startTimer() {

    if (!running) {
        running = true;
        intervalId = setInterval(updateTimer, 1000);
    }
}

function stopTimer() {
    if (running) {
        running = false;
        clearInterval(intervalId);
    }
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById('timer').textContent = '00:00:00';
}