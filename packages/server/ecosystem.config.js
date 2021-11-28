module.exports = {
  apps : [{
    name   : "dog_server",
    script : "./src/index.js",
    watch: ["src"]
  }],
  deploy: {
    development: {
      user: "nodejs",
      host: "167.172.252.56",
      path: "/home/nodejs/dog",
      repo: "git@github.com:calebcarithers/dog.git",
      ref: "origin/feat/server",
      "post-deploy" : "cd /home/nodejs/dog/current/packages/server && pm2 startOrRestart ecosystem.config.json --env production",
    }
  }
}
