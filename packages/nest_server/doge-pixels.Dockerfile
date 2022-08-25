##############################
# BUILD FOR LOCAL DEVELOPMENT
##############################
FROM node:18-alpine as development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node prisma ./prisma

RUN yarn install --frozen-lockfile

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

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

RUN yarn install --frozen-lockfile

USER node

##############################
# PRODUCTION
##############################
FROM node:18-alpine as production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Migrate the db
RUN yarn prisma migrate deploy

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
