server dependencies
- node.js
- pw2
- redis
- nginx




dev environment:
ssh nodejs@167.172.252.56

**Monitoring**
https://app.pm2.io/bucket/61af752cb0423ed2d0960b2d/backend/overview/servers

**Deploy**
- make sure you have `pm2` installed globally
- ensure your ssh key has been added to `authorized keys` on 167.172.252.56
- run `yarn dev:deploy` from the root of this directory. (deployment details are specified in ecosystem.config.js)


