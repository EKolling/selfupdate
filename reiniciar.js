import cron from "node-cron";
import exec from "child_process";

export default class Reiniciador {
  //const configFile = './configuracoes/configmonitoramento.txt';

  async reiniciar() {
    try {
      //module.exports = async () => {
      // Agendando tarefa para executar às 6h ou 9h das terças-feiras
      //cron.schedule('0 6,9 * * 2', () => {
      console.log("Reiniciando o computador...");
      exec("shutdown -r -f", (error, stdout, stderr) => {
        if (error) {
          throw new Error();

          return;
        }
        console.log(`Resultado da reinicialização: ${stdout}`);
      });
      //});
    } catch (error) {
      console.error(`Erro ao reiniciar o computador: ${error}`);
    }
  }
}
