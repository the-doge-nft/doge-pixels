const express = require("express");
const childProcess = require("child-process");
require("dotenv").config();

const app = express();

const port = 3009;
const dockerRegistery = "calebcarithers";
const dockerUser = process.env.DOCKER_USER;
const dockerPassword = process.env.DOCKER_PW;

let ciEndpoint, appEnv;

if (process.env.APP_ENV === "production") {
  ciEndpoint = "prod-ci-endpoint";
  appEnv = "production";
} else if (process.env.APP_ENV === "development") {
  ciEndpoint = "dev-ci-endpoint";
  appEnv = "development";
} else {
  throw new Error("Invalid APP_ENV");
}

const log = (msg) => {
  console.log(`[${new Date().toISOString()}] ${msg}`);
};

const loginDocker = () => {
  const login = childProcess.execSync(
    `$ echo "${dockerPassword}" | docker login --username ${dockerUser} --password-stdin`
  );
  log("login:: ", login);
};

app.get("status", (req, res) => {
  res.send("🏃‍️");
});

app.get("/" + ciEndpoint, async (req, res) => {
  const hash = req.query.SHA1;
  if (!hash) {
    throw new Error("Must supply build hash");
  }

  log(`got SHA1: ${hash}`);

  const imageName = `${dockerRegistery}/pixels`;
  const imageHash = `${hash}`;
  const fullImageName = `${imageName}:${imageHash}`;

  log(`full image name: ${fullImageName}`);

  const imageExists = childProcess
    .execSync(`docker manifest inspect ${fullImageName} > /dev/null ; echo $?`)
    .toString();
  if (imageExists !== "0") {
    log(
      `image (${hash}) not found -- check returned: ${imageExists} -- trying to pull`
    );
    const pull = childProcess.execSync(`docker pull ${fullImageName}`);
    log(`pull (${hash}) result: ${pull.toString()}`);

    const up = childProcess.execSync(`./run-deployment.sh ${hash} ${appEnv}`);
    log(`docker up result: ${up.toString()}`);
  }

  try {
  } catch (e) {
    log(e);
    log("got error");
    res.status(500).send(e.message);
  }
  res.send("OK");
});
