const requestButton = document.getElementById('myButton');

// Adicionar um evento de clique ao botão
requestButton.addEventListener('click', () => {
  // Obter os valores de host e port dos campos de input
  const host = document.getElementById('ipServer').value;
  const port = parseInt(document.getElementById('ipPort').value);

  // Chamar a função makeRequest ao clicar no botão e passar host e port como argumentos
  window.electron.makeRequest(host, port);
});
