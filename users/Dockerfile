FROM node:10

# Create application working directory
WORKDIR /app

# copy app dependencies
COPY package*.json ./

# RUN npm install
RUN npm install --only=production

# Bundle app source
COPY . .
#Expose port for users microservice
EXPOSE 3000
#Start server
CMD [ "npm", "start" ]