FROM node:8

MAINTAINER Filiosoft Open Source <opensource@filiosoft.com>

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 3000
CMD [ "npm", "start" ]