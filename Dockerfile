FROM node:14.15.4-alpine3.12

# Create app directory
RUN mkdir -p /ChattingService
WORKDIR /ChattingService

# Install app dependencies
COPY package.json /ChattingService
RUN npm install
RUN npm install -g socket.io
COPY . /ChattingService
RUN npm link socket.io

# Bundle app source
RUN ls -al
EXPOSE 8008
CMD [ "node" , "app.js" ]