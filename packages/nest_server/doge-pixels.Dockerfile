##############################
# BUILD FOR LOCAL DEVELOPMENT
##############################
FROM node:18-alpine as development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node prisma ./prisma/

RUN yarn install

COPY --chown=node:node . .

# generate prisma client
RUN yarn prisma:generate

USER node


##############################
# BUILD FOR PRODUCTION
##############################
FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node prisma ./prisma/
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn run build

# this is prod!
ENV NODE_ENV production

# install only prod deps: `prisma` is a prod dependecy since we need it for `prisma migrate` in the prod container
RUN yarn install --frozen-lockfile --prod

USER node

##############################
# PRODUCTION
##############################
FROM node:18-alpine as production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/yarn.lock ./yarn.lock
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma


# Migrate db & start build
CMD [ "yarn", "start:migrate:prod" ]
