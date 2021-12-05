const fs = require("fs");

const srcFile = "../hardhat/hardhat_contracts.json"
const dstFile = "./src/contracts/hardhat_contracts.json"
const srcFileExists = fs.existsSync(srcFile)
const dstFileExists = fs.existsSync(dstFile)

if (srcFileExists) {
  try {
    fs.copyFile(srcFile, dstFile, (err) => {
      if (err) throw err
    });
    console.log("src/contracts/hardhat_contracts.json created.");
  } catch (error) {
    console.log("error hit");
    throw error
  }
} else {
  throw Error("Could not find hardhat contracts")
}
