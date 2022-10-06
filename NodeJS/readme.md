# NodeJS training

## Index

1. [Intro](#intro)
2. [Crud (MySQL)](#crud-mysql)
3. [Ecom app using microservices architecture](#ecom-app-using-microservices-architecture)

### Intro

- Creating simple server using HTTP module in node.
- Returning response with adequate headers, status and data to a simple request.

### Crud (MySQL)

- Modules used:
    1. express
    2. body-parser
    3. mysql

- Used **Stored Procedures** for create and update along with normal sql queries.

### Ecom app using microservices architecture

- 3 services
- RabbitMQ is used for message queuing
- Modules used for message queuing: **amqplib**
- Using mongo db
- `rabbitmq-plugins enable rabbitmq_management