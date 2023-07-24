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


function dec2Bin(decimal) {
    let binario = decimal.toString(2);
    binario = binario.padStart(16, '0');
    binario = binario.slice(-16);
    return binario;
  }

 function bin2Hex(binario) {
    const decimal = parseInt(binario, 2);
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
    console.log("alexadre");
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
            const payloadBat = 'CA';
            var tempo  = minutes + hours*60;
            if(tempo <= 1){
                tempo = 1;
            }
            const mask = 0b1111111;
            var byte1 = (tempo & mask) << 1;
            var byte2 = (tempo >> 7) & mask;
            var result = ((byte1 << 8) | byte2);
            //entrada = 106 saida -> D400  | entrada = 168 saida -> 5001 | entrada = 32767 saida -> 7FFF
            //console.log("result: " + result.toString(2));
            //console.log(result.toString(16));
            var package = headerPack + ',' + fleet + ',' + version + ',' + time + ',' + data + ',' + fleetRecetor + ',' + rssi + ',' + snr + ',' + frameCode + ',' + frameId + ',' + payloadBat + result.toString(16).toUpperCase() + ',';
            package = checksum(package);
    }
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