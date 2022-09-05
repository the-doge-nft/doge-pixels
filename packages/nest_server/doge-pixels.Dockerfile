##############################
# BUILD FOR LOCAL DEVELOPMENT
##############################
# alpine distros are not supported well by canvas dependency
# https://github.com/Automattic/node-canvas/issues/866
FROM node:16-bullseye as development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node prisma ./prisma/
COPY --chown=node:node . .

# make sure we get dev deps installed
RUN yarn install --production=false

# generate prisma client
RUN yarn prisma:generate

USER node


##############################
# BUILD FOR PRODUCTION
##############################
FROM node:16-bullseye as build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node prisma ./prisma/
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# this is prod!
ENV NODE_ENV production

# install only prod deps: `prisma` is a prod dependecy since we need it for `prisma migrate` in the prod container
RUN yarn install --frozen-lockfile --production

# Run the build command which creates the production bundle
RUN yarn build

USER node

##############################
# PRODUCTION
##############################
FROM node:16-bullseye as production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/yarn.lock ./yarn.lock
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma


# Migrate db & start build
CMD [ "yarn", "start:migrate:prod" ]
