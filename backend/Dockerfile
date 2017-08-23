FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

#RUN npm install -g pm2
RUN npm install

# Bundle app source
COPY . /usr/src/app
WORKDIR /usr/src/app

EXPOSE 8081
#CMD [ "pm2","start", "server.js" ]
CMD ["node", "server.js"]
