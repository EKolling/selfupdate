const cron = require('node-cron');
const exec = require('child_process').exec;

// Agendando tarefa para executar às 6h ou 9h das terças-feiras
cron.schedule('0 6,9 * * 2', () => {
  console.log('Reiniciando o computador...');
  exec('shutdown -r -f', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao reiniciar o computador: ${error}`);
      return;
    }
    console.log(`Resultado da reinicialização: ${stdout}`);
  });
});
