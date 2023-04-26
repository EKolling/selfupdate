const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Obter o caminho da pasta Downloads
const downloadFolder = path.join(process.env.USERPROFILE, 'Downloads');

// Encontrar o arquivo do instalador mais recente
let latestInstaller = '';
let latestVersion = '';
fs.readdirSync(downloadFolder).forEach(file => {
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
  console.error('Não foi possível encontrar o arquivo do instalador mais recente.');
  return;
}
// Encerra a aplicação antiga, para nao pedir OK durante a instalação.
exec('taskkill /im programaemprocesso.exe /f', (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao encerrar o processo: ${err.message}`);
      return;
    }
});

// Executar o instalador
const installerPath = path.join(downloadFolder, latestInstaller);
exec(`"${installerPath}"`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro ao executar o instalador: ${err.message}`);
    return;
  }

  console.log('Instalação concluída com sucesso.');
});
