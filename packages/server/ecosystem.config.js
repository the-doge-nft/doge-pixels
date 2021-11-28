module.exports = {
  apps : [{
    name   : "dog_server",
    // cwd: "/home/nodejs/dog/source/packages/server",
    script : "./src/index.js",
    watch: ["src"],
    env_development: {
      NODE_ENV: 'development'
    }
  }],
  deploy: {
    development: {
      user: "nodejs",
      host: "167.172.252.56",
      path: "/home/nodejs/dog",
      repo: "git@github.com:calebcarithers/dog.git",
      ref: "origin/feat/server",
      // "post-deploy": "echo $(pwd)"
      // "post-deploy": "pm2 --cwd /home/nodejs/dog/source/packages/server startOrRestart ecosystem.config.json --env development",
      "post-deploy": "pm2 --cwd /home/nodejs/dog/source/packages/server start ecosystem.config.js --env development"
    }
  }
}
