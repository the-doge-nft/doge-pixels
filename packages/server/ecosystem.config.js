module.exports = {
  apps : [{
    name   : "dog_server",
    script : "./src/index.js",
    watch: ["src"],
    // there are other env vars that must be set.
    // check .env.test
    env_development: {
      NODE_ENV: 'production',
      APP_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      APP_ENV: 'production'
    }
  }],
  deploy: {
    development: {
      key: "deploy.key",
      user: "nodejs",
      host: "167.172.252.56",
      path: "/home/nodejs/dog",
      repo: "git@github.com:calebcarithers/dog.git",
      ref: "origin/dev",
      "post-deploy": "cd /home/nodejs/dog/current/packages/server && yarn install --production --frozen-lockfile && yarn dev:start",
    },
    production: {
      key: "deploy.key",
      user: "nodejs",
      host: "143.244.147.62",
      path: "/home/nodejs/dog",
      repo: "git@github.com:calebcarithers/dog.git",
      ref: "origin/master",
      "post-deploy": "cd /home/nodejs/dog/current/packages/server && yarn install --production --frozen-lockfile && yarn prod:start",
    }
  }
}
