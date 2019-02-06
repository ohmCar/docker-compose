#Base Image Reference
FROM node:10

#Specifying work directory
WORKDIR /usr/src/nodejsApp

#COPY dependency configuration file
COPY package*.json ./

#Setting dependencies
RUN npm install

#Copying app

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]