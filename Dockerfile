FROM node:14.15.4-alpine3.12

# Create app directory
RUN mkdir -p /ChattingService
WORKDIR /websocket_srv

# Install app dependencies
COPY package.json /ChattingService
RUN npm install

# Bundle app source
COPY . /ChattingService

EXPOSE 8008
CMD [ "node" , "app.js" ]