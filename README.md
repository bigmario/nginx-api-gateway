# NGINX as an API Gateway for Securing Microservices

We need to request a x509 standard certificate from OpenSSL using RSA 2048 bit encryption that expires after 1 year. 

We are placing these certificates in our nginx/ssl folder as our private key (nginx.key) and our public certificate (nginx.crt).

This is the command we need to execute prior to running the containers

`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/nginx.key -out nginx/ssl/nginx.crt`