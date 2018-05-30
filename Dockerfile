FROM node:8

MAINTAINER Noah Prail <noah@prail.net>

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]