FROM node:14.15.4-alpine3.12

# Create app directory
RUN mkdir -p /websocket_srv
WORKDIR /websocket_srv

# Install app dependencies
COPY package.json /websocket_srv
RUN npm install

# Bundle app source
COPY . /websocket_srv

EXPOSE 8008
CMD [ "node" , "app.js" ]