//compara arquivo local e do servidor, se diferente, salva na pasta Downloads.

const vi = require('win-version-info');
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Caminho para o programa local
const programPath = 'C:\\LOCAL\\do\\arquivo\\instalado.exe';

// Lendo o arquivo config.txt
const configFile = fs.readFileSync('./config.txt', 'utf8');
const config = JSON.parse(configFile);

// Criando a conexão FTP
const client = new ftp.Client();
client.ftp.verbose = true;

(async () => {
  try {
    // Estabelecendo a conexão
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: false
    });

    // Obtendo a lista de arquivos na pasta
    const list = await client.list();

    // Procurando o arquivo
    const file = list.find(f => f.name.includes('BUSCA DE NOME DO ARQUIVO'));

    // Extraindo a versão do arquivo no servidor
    const serverVersion = file.name.match(/Setup (\d+\.\d+\.\d+)\.exe/)[1];

    // Obtendo a versão do programa local
    const info = vi(programPath);
    const localVersion = info.FileVersion;

    console.log(`Versão local do programa: ${localVersion}`);
    console.log(`Versão do arquivo no servidor: ${serverVersion}`);

    // Verificando se a versão do arquivo no servidor é mais recente do que a local
    if (serverVersion > localVersion) {
      console.log('O arquivo no servidor é mais atualizado. Baixando...');

      // Criando o caminho completo para a pasta "Downloads"
      const downloadsDir = path.join(process.env.USERPROFILE, 'Downloads');

      // Criando o caminho completo para o arquivo local na pasta "Downloads"
      const localFilePath = path.join(downloadsDir, file.name);

      // Baixando o arquivo para a pasta "Downloads"
      await client.downloadTo(localFilePath, file.name);

      console.log('Arquivo baixado com sucesso!');
    } else {
      console.log('A versão do arquivo no servidor é igual ou anterior à versão local. Não é necessário fazer o download.');
    }

    // Encerrando a conexão
    await client.close();
  } catch(err) {
    console.error(err);
  }
})();
