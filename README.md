
# Web Authentication Project

## Overview

This project implements a secure web authentication system using PostgreSQL, Express.js, and WebAuthn with EJS for templating. The application includes user registration and login functionalities, enhanced with WebAuthn for robust security. It also utilizes Docker for simplified deployment and scalability.

## Technologies Used

- PostgreSQL
- Express.js
- EJS
- WebAuthn (SimpleWebAuthn)
- Node.js
- Docker

## Features

- User Registration: Register with username and password, followed by WebAuthn passkey registration.
- User Login: Login using username and WebAuthn passkey.
- Secure Authentication: Generates and verifies WebAuthn registration and login challenges.
- Dockerized Setup: Easy deployment with Docker.

## Project Structure

```
.
├── config
│   └── db.js             # Database configuration
├── controllers
    └── userController.js
│   └── authController.js # Authentication controllers
├── models
│   ├── passkeyModel.js    # Passkey model
│   └── userModel.js       # User model
├── services
│   └── authService.js     # Authentication services
├── utils
│   ├── cryptoUtils.js     # Cryptographic utilities
│   └── simpleWebAuthnUtils.js  # SimpleWebAuthn utilities
├── views
│   ├── login.ejs          # Login page template
│   └── register.ejs       # Register page template
├── .env                   # Environment variables
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── index.js               # Entry point
├── package.json           # NPM package configuration
└── README.md              # Project documentation
```

## Setup and Installation

### Prerequisites

- Docker
- Node.js

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-authentication.git
   cd web-authentication
   ```

2. Create a `.env` file with the following content:
   ```env
   DATABASE_URL=postgres://postgres:root@db:5432/postgres
   ```

3. Build and start the Docker containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - The web application will be running on `http://localhost:3000`.
   - The PostgreSQL database will be accessible on port `5432`.

## Docker Configuration

### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://postgres:root@db:5432/postgres
    networks:
      - app-network

  db:
    image: postgres:latest
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: root
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  app-network:
    driver: bridge
```

### Dockerfile

```dockerfile
FROM node:19

WORKDIR /usr/src/app

CMD ["npx", "nodemon", "index.js"]

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app/
```

## Usage

### Register a User

1. Navigate to the registration page at `http://localhost:3000/register`.
2. Fill in the username and password fields and submit the form.
3. Complete the WebAuthn passkey registration process.

### Login

1. Navigate to the login page at `http://localhost:3000/login`.
2. Enter your username and submit the form.
3. Complete the WebAuthn authentication process.


## Contributing

Feel free to submit issues, fork the repository, and send pull requests. Contributions are always welcome.
Feel free to customize further based on your specific needs!
