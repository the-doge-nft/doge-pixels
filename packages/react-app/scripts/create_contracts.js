const fs = require("fs");
const path = require("path");

const srcFile = path.join(__dirname, "../../hardhat/hardhat_contracts.json")
const dstFile = path.join(__dirname, "../src/contracts/hardhat_contracts.json")
const srcFileExists = fs.existsSync(srcFile)
const dstFileExists = fs.existsSync(dstFile)

console.log(`src: ${srcFile}`)
console.log(`dst: ${dstFile}`)


if (srcFileExists) {

  if (!dstFileExists) {
    console.log("📂 creating ./src/contracts directory")
    fs.mkdirSync("./src/contracts", {recursive: true})
  }

  try {
    fs.copyFile(srcFile, dstFile, (err) => {
      if (err) {
        console.log("error hit copying file")
        throw err
      }
    });
    console.log("✅ src/contracts/hardhat_contracts.json created.");
  } catch (error) {
    console.log("error hit");
    throw error
  }
} else {
  throw Error("Could not find hardhat contracts")
}
