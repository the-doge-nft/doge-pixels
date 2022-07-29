module.exports = {
  apps : [{
    name   : "dog_server",
    script : "./src/index.js",
    watch: "false",
    ignore_watch: ["./combined.log", './src/assets/images', 'src/assets/images/pointer.png'],
    max_memory_restart: '750M',
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    development: {
      key: "deploy.key",
      user: "nodejs",
      host: "167.172.252.56",
      path: "/home/nodejs/dog",
      repo: "git@github.com:calebcarithers/doge-pixels.git",
      ref: "origin/dev",
      "post-deploy": "cd /home/nodejs/dog/current/packages/server && yarn install --production --frozen-lockfile && yarn dev:start",
    },
    production: {
      key: "deploy.key",
      user: "nodejs",
      host: "143.244.147.62",
      path: "/home/nodejs/dog",
      repo: "git@github.com:calebcarithers/doge-pixels.git",
      ref: "origin/master",
      // TODO: dev and prod server setup is different. prod has git files in the ~/dog repo where the actual node_modules are pulled from
      // dev server does not have this. last deploy we added new packages & deploy failed due to the packages being installed in the wrong location
      "post-deploy": "cd /home/nodejs/dog/current/packages/server && yarn install --production --frozen-lockfile && yarn prod:start",
    }
  }
}
