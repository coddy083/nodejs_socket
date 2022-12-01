FROM node:19-alpine3.15

# Create app directory
RUN mkdir -p /ChattingService
WORKDIR /ChattingService

# Install app dependencies
COPY package.json /ChattingService
RUN npm install -g npm@9.1.3
RUN npm install
RUN npm install --production --save socket.io
COPY . /ChattingService
RUN npm link socket.io

# Bundle app source
RUN ls -al
EXPOSE 8008