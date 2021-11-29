server dependencies
- node.js
- pw2
- redis
- nginx




dev environment:
ssh nodejs@167.172.252.56

**Deploy**
- make sure you have `pm2` installed globally
- ensure your ssh key has been added to `authorized keys` on 167.172.252.56
- run `yarn dev:deploy` from the root of this directory. (deployment details are specified in ecosystem.config.js)

