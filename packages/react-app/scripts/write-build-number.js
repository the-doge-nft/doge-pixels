const fs = require("fs")
const {execSync} = require("child_process")
const path = require("path")

const PREFIX = `/*************************************************************************************
***** THIS FILE IS AUTO-GENERATED. YOUR CHANGES WILL BE OVERWRITTEN SO DON'T WASTE YOUR TIME ****
*************************************************************************************************/`

const writeFile = (outputFileName, content) => {
  content = `${PREFIX}
  ${content}
  `
  fs.writeFile(outputFileName, content, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log(`${outputFileName} written`)
  })
}

const buildNumberPath = path.join(__dirname, '..', 'src', 'build_number.ts')

const lastHash = execSync("git rev-parse HEAD").toString().trim()
const branchName  = execSync("git rev-parse --abbrev-ref HEAD").toString().trim()
const lastMessage = execSync("git log -1")
const buildNumber = parseInt(execSync("git log HEAD --pretty=oneline | wc -l").toString().trim());

const data = {
  branchName,
  lastHash,
  // lastMessage: isDevModeEnabled() ? lastMessage : "----",
  buildNumber: `#${(buildNumber + '').padStart(6, '0')}`,
  buildTime: new Date(),
}

const content = `
const buildInfo = ${JSON.stringify(data, null, 2)}
export default buildInfo;`

writeFile(buildNumberPath, content)
