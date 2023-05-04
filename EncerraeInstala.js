import { readdirSync } from "fs";
import { join } from "path";
import { exec } from "child_process";

export default class Encerrador {
  //const configFile = './configuracoes/configmonitoramento.txt';

  async encerrar() {
    try {
      // Obter o caminho da pasta Downloads
      const downloadFolder = join(process.env.USERPROFILE, "Downloads");

      // Encontrar o arquivo do instalador mais recente
      let latestInstaller = "";
      let latestVersion = "";
      readdirSync(downloadFolder).forEach((file) => {
        const match = file.match(/^Setup (\d+\.\d+\.\d+)\.exe$/i);
        if (match) {
          const version = match[1];
          if (version > latestVersion) {
            latestInstaller = file;
            latestVersion = version;
          }
        }
      });

      // Verificar se foi encontrado um arquivo do instalador
      if (!latestInstaller) {
        console.error(
          "Não foi possível encontrar o arquivo do instalador mais recente."
        );
        return;
      }

      exec("taskkill /im PROCESSO.exe /f", (err, stdout, stderr) => {
        if (err) {
          console.error(`Erro ao encerrar o processo: ${err.message}`);
          return;
        }
      });

      // Executar o instalador
      const installerPath = join(downloadFolder, latestInstaller);

      await new Promise((resolve, reject) => {
        exec(`"${installerPath}"`, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
          console.log("Instalação concluída com sucesso.");
        });
      });
      return true;
    } catch (error) {
      console.error(`Erro ao executar o instalador: ${err.message}`);
      return;
    }
  }
}
