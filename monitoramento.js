const fs = require('fs');
const { exec } = require('child_process');

// Ler arquivo de configuração
const configFile = './monitorprocesso.txt';
let config = {};

try {
  const data = fs.readFileSync(configFile, 'utf8');
  const lines = data.split('\n');

  for (let line of lines) {
    if (line.trim() !== '') {
      const [key, value] = line.split('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    }
  }
} catch (err) {
  console.error(`Erro ao ler o arquivo de configuração: ${err}`);
  process.exit(1);
}

// Iniciar loop de monitoramento
let counter = 0;
const interval = setInterval(() => {
  for (let key in config) {
    if (key.startsWith('process')) {
      const process = config[key];
      const pathKey = key.replace('process', 'path');
      const path = config[pathKey];
      
      // Verificar se o processo está em execução
      exec(`tasklist /FI "IMAGENAME eq ${process}.exe"`, (err, stdout) => {
        if (err) {
          console.error(`Erro ao executar o comando: ${err}`);
          return;
        }

        if (stdout.includes(process)) {
          console.log(`O processo ${process} está em execução.`);
          counter = 0; // Reiniciar contador
        } else {
          console.log(`O processo ${process} não está em execução.`);
          counter += 10; // Incrementar contador
          if (counter >= 10) {
            // Iniciar o processo
            exec(`start "" "${path}"`, (err) => {
              if (err) {
                console.error(`Erro ao executar o comando: ${err}`);
                return;
              }
              console.log(`O processo ${process} foi iniciado.`);
            });
            counter = 0; // Reiniciar contador
          }
        }
      });
    }
  }
}, 10000);
