FROM node:16.13.2-alpine as builder
WORKDIR /usr/app
COPY ./package.json ./
RUN yarn install
COPY . .
CMD [ "yarn", "dev" ]