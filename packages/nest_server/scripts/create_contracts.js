const fs = require('fs');

const srcFile = '../hardhat/hardhat_contracts.json';
const dstFile = './src/contracts/hardhat_contracts.json';
const srcFileExists = fs.existsSync(srcFile);
const dstFileExists = fs.existsSync(dstFile);

if (srcFileExists) {
  if (!dstFileExists) {
    console.log('📂 creating ./src/contracts directory');
    fs.mkdirSync('./src/contracts', { recursive: true });
  }

  try {
    fs.copyFile(srcFile, dstFile, (err) => {
      if (err) {
        console.log('error hit copying file');
        throw err;
      }
    });
    console.log('✅ src/contracts/hardhat_contracts.json created');
  } catch (error) {
    console.log(error);
  }
} else {
  console.log('⚠️ could not find hardhat contracts');
}
