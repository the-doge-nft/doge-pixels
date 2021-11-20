FROM node:12-alpine

#EXPOSE 8001

#ARG NODE_ENV
#ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD ./src /app
RUN yarn install
