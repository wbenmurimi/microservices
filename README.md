# Microservices Demo Applications
**Microservice implementation with Nodejs and MongoDB**

There are 3 microservices  and each has its own collection

- **Users microservice:** Creates users and manages authentication
- **Products microservice:** Creates products and manages product
- **Orders microservice:** Manages the orders and interacts with the users and products collections to retrieve data. 

You can manipulate the port numbers that the services run on on the .env file but to not forget to update the same on the Dockerfiles

## Running the applications
### Manually
Update the database connection by updating the variable DATABASE_URL on all the .env files in the app folders

Install the node_modules in each of the applications by running npm install 

Run the server nodemon serve

Interact with the api via postman

### Docker
Update the database connection by updating the variable DATABASE_URL on all the .env files in the app folders

Build docker images for each of the applications eg `docker build --no-cache --rm --tag users:v1 .`

Run the docker container for each application eg: `docker run --rm -d -p 3000:3000 users:v1`

Interact with the api via postman
