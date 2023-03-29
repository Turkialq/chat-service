#Base OS
FROM node:16.13.2-alpine as builder

#New path for the container
WORKDIR /usr/app
#Copy json file with scripts
COPY ./package.json ./
#First command to start with the container
RUN yarn install

#bundly the app
COPY . .

#after pakages have been installed run this
CMD [ "yarn", "dev" ]