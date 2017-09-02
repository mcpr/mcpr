FROM node:8

MAINTAINER Filiosoft Open Source <opensource@filiosoft.com>

WORKDIR /usr/src/app

COPY package.json yarn.lock bower.json ./

RUN yarn install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]