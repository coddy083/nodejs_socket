FROM node:8.9.4-alpine

# Create app directory
RUN mkdir -p /websocket_srv
WORKDIR /websocket_srv

# Install app dependencies
COPY package.json /websocket_srv
RUN npm install

# Bundle app source
COPY . /websocket_srv

EXPOSE 4005
CMD [ "node" , "app.js" ]