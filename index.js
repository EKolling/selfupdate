//vincule os scripts
import Copiador from "./src/ComparaeCopia.js";
import Encerrador from "./src/EncerraeInstala.js";
import Monitor from "./src/monitoramento.js";
import Reiniciador from "./src/reiniciar.js";

import exec from "child_process";

const monitor = new Monitor();
const copiador = new Copiador();
const encerrador = new Encerrador();
const reiniciador = new Reiniciador();

function executarScript(nomeScript) {
  exec(`node ${nomeScript}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao executar o script ${nomeScript}: ${err}`);
      return;
    }
    console.log(stdout);
  });
}

function esperar(tempo) {
  return new Promise((resolve) => setTimeout(resolve, tempo));
}

await monitor.start_monitorar();

setInterval(async () => {
  if (await copiador.copiar()) {
    await monitor.stop_monitorar();
    if (await encerrador.encerrar()) {
      await monitor.start_monitorar();
  }

  //}, 6 * 60 * 60 * 1000);
}}, 60 * 1000);

setInterval(() => {
  reiniciador.reiniciar();
  //}, 7 * 24 * 60 * 60 * 1000);
}, 5 * 60 * 1000);

console.log("Script principal iniciado.");
