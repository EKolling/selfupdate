import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

//module.exports = async () => {
// Ler arquivo de configuração
export default class Monitor {
  //const configFile = './configuracoes/configmonitoramento.txt';

  constructor() {
    
    this.monitoramento = true;
  }

  async start_monitorar() {
    //if (this.monitoramento) {
      //return;
    //}

    this.monitoramento = true;
    console.log("Monitoramento ligado");
    this.monitorar();
  }

  monitorar() {

    let config = {};


    try {
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = dirname(currentFilePath);
      const configFilePath = join(
        currentDirPath,
        "../configuracoes/configmonitoramento.txt"
      );
      const data = fs.readFileSync(configFilePath, "utf8");
      const lines = data.split("\n");

      for (let line of lines) {
        if (line.trim() !== "") {
          const [key, value] = line.split("=");
          if (key && value) {
            config[key.trim()] = value.trim();
          }
        }
      }
      // Iniciar loop de monitoramento
      let counter = 0;
      const interval = setInterval(() => {
        if (this.monitoramento == false) {
          return;
        }
        console.log('Monitorando.......')
        for (let key in config) {
          if (key.startsWith("process")) {
            const process = config[key];
            const pathKey = key.replace("process", "path");
            const path = config[pathKey];

            // Verificar se o processo está em execução
            exec(
              `tasklist /FI "IMAGENAME eq ${process}.exe"`,
              (err, stdout) => {
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
              }
            );
          }
        }
      }, 30000);
    } catch (err) {
      console.error(`Erro ao ler o arquivo de configuração: ${err}`);
      process.exit(1);
    }
  }

  async stop_monitorar() {
    if (!this.monitoramento) {
      return;
    }
    this.monitoramento = false;
    console.log("Monitoramento desligado");
  }

  async restart_monitorar() {
    this.monitoramento = true;
    start_monitorar();
  }
}
