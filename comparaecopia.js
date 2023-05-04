//compara arquivo local e do servidor, se diferente, salva na pasta Downloads.

import vi from "win-version-info";
import { Client } from "basic-ftp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export default class Copiador {
  async copiar() {
    try {
      // Caminho para o programa local
      const programPath =

      "C:\\Users\\HELPER\\AppData\\Local\\Programs\\helper-totem\\helper-totem.exe";

      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = dirname(currentFilePath);
      const configFilePath = join(
      currentDirPath, "../configuracoes/acessoftp.txt")

      // Lendo o arquivo config.txt
      const configFile = readFileSync(configFilePath, "utf8");

      const config = JSON.parse(configFile);

      // Criando a conexão FTP
      const client = new Client();
      client.ftp.verbose = true;

      // Estabelecendo a conexão
      //await new Promise((resolve, reject) => {
      
        await client.access({
        host: config.host,
        user: config.user,
        password: config.password,
        secure: false,
      });


      // Obtendo a lista de arquivos na pasta
      const list = await client.list();

      // Procurando o arquivo
      const file = list.find((f) => f.name.includes("helper-totem Setup"));

      // Extraindo a versão do arquivo no servidor
      const serverVersion = file.name.match(
        /helper-totem Setup (\d+\.\d+\.\d+)\.exe/
      )[1];

      // Obtendo a versão do programa local
      const info = vi(programPath);
      const localVersion = info.FileVersion;

      console.log(`Versão local do programa: ${localVersion}`);
      console.log(`Versão do arquivo no servidor: ${serverVersion}`);

      // Verificando se a versão do arquivo no servidor é mais recente do que a local
      if (serverVersion > localVersion) {
        console.log("O arquivo no servidor é mais atualizado. Baixando...");

        // Criando o caminho completo para a pasta "Downloads"
        const downloadsDir = join(process.env.USERPROFILE, "Downloads");

        // Criando o caminho completo para o arquivo local na pasta "Downloads"
        const localFilePath = join(downloadsDir, file.name);

        // Baixando o arquivo para a pasta "Downloads"
        await client.downloadTo(localFilePath, file.name);
       

        console.log("Arquivo baixado com sucesso!");

        return true

      } else {
        console.log(
          "A versão do arquivo no servidor é igual ou anterior à versão local. Não é necessário fazer o download."
        );
      }

      // Encerrando a conexão
      await client.close();
    } catch (err) {
      console.error(err);
    }
  }
}
