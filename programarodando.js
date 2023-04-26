//verifica se o programa esta em execução, se nao esta, manda executar
//tempo de 10 segundos

const { exec } = require('child_process');

// nome do processo que você deseja verificar
const processName = 'programa.exe';

function checkProcess() {
  // executa o comando 'tasklist' para obter uma lista de processos em execução
  exec('tasklist', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }

    // verifica se o nome do processo está na saída do comando
    if (stdout.indexOf(processName) > -1) {
      console.log(`O processo ${processName} está em execução.`);
    } else {
      console.log(`O processo ${processName} não está em execução. Reiniciando...`);

      // inicia o programa novamente usando o módulo child_process
      exec('C:\\caminho\\do\\programa\\executavel.exe', (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }

        console.log(`O processo ${processName} foi reiniciado.`);
      });
    }
  });
}

// chama a função checkProcess a cada 30 segundos
setInterval(checkProcess, 10000);
