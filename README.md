# NGINX as an API Gateway for Securing Microservices
## Requirements
**Docker**: Installation instructions can be found here: https://docs.docker.com/install/

In addition, we need to request a x509 standard certificate from OpenSSL using RSA 2048 bit encryption (example expires after 1 year). 

place these certificates in nginx/ssl folder as private key (nginx.key) and public certificate (nginx.crt).

Run this command prior to building the containers

`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/nginx.key -out nginx/ssl/nginx.crt`

## Description
Implementation fon an NGINX API Gateway, centralising and distributing API calls to several independent services, acting as a proxy and adding authentication and encryption for all traffic through the API gateway, ensuring a single point of contact, rather than traffic going directly to each microservice.

## Deployment
```bash
# Import collection "NGINX API Gateway.postman_collection.json" on Postman or preferred client

$ npm install
$ docker-compose build --no-cache
$ docker-compose up -d
```

## Scaling Services
```bash
    # coffe service as an example
    # can be any of the services in docker-compose file
    docker-compose scale coffee=4
```