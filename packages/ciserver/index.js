const express = require("express");
const childProcess = require("child_process");
require("dotenv").config();

const app = express();

const port = 3009;
const dockerRegistery = "calebcarithers";

let ciEndpoint, appEnv;

if (process.env.APP_ENV === "production") {
  ciEndpoint = "paragraph-restrict-hip-ambiguous-hand-fascinate";
  appEnv = "production";
} else if (process.env.APP_ENV === "staging") {
  ciEndpoint = "serve-project-jurisdiction-stand-peak-elegant";
  appEnv = "staging";
} else {
  throw new Error("Invalid APP_ENV");
}

const log = (msg) => {
  console.log(`[${new Date().toISOString()}] ${msg}`);
};

const maybeBackupDb = () => {
  console.log("TODO ⚠️⚠️⚠️⚠️: BACKUP DB");
};

const pullImage = (hash) => {
  const imageName = `${dockerRegistery}/doge-pixels`;
  const imageHash = `${hash}`;
  const fullImageName = `${imageName}:${imageHash}`;
  log(`full image name: ${fullImageName}`);

  const imageExists = childProcess
    .execSync(`docker manifest inspect ${fullImageName} > /dev/null ; echo $?`)
    .toString();
  if (imageExists !== "0") {
    log(`image (${hash}) not found:: check returned: ${imageExists}`);
    log(`trying to pull image: ${hash}`);
    const pull = childProcess.execSync(`docker pull ${fullImageName}`);
    log(`pull (${hash}) result: ${pull.toString()}`);

    maybeBackupDb();

    const up = childProcess.execSync(`./run-deployment.sh ${hash} ${appEnv}`);
    log(`docker up result: ${up.toString()}`);

    // current servers are pretty small so we'll prune after each deploy
    const pruneSystem = childProcess.execSync('docker system prune --all -f')
    log(`docker prune system ${pruneSystem.toString()}`)
  }
};

app.get("/status", (req, res) => {
  res.send("🏃‍️");
});

app.get("/logs", (req, res) => {
  const logs = childProcess.execSync('pm2 logs ciserver --lines 250 --nostream')
  return res.send(logs)
})

app.get("/" + ciEndpoint, async (req, res, next) => {
  const hash = req.query.SHA1;
  if (!hash) {
    return next(new Error("Must supply build hash"));
  }

  log(`got SHA1: ${hash}`);

  try {
    pullImage(hash);
  } catch (e) {
    log(e);
    log("got error");
    return res.status(500).send(e.message);
  }
  return res.send(`✅🐕 ${hash} has been deployed`);
});

app.listen(port, () => {
  console.log(
    `[${process.env.APP_ENV}] CI SERVER LISTENING ON PORT: ${port} & endpoint ${ciEndpoint}`
  );
});
