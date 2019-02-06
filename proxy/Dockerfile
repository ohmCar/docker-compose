#Base Image Reference
FROM node:10

#Specifying work directory
WORKDIR /usr/src/proxy

#COPY dependency configuration file
COPY package*.json ./

#Setting dependencies
RUN npm install && npm install -g nodemon

#Copying app

COPY . .

EXPOSE 9000
CMD [ "npm", "start" ]