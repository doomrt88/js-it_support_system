# IT Support Management

This is a simple IT Support Ticketing System

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine. You can download it from [here](https://nodejs.org/).
- MongoDB installed and running on your machine. You can download it from [here](https://www.mongodb.com/try/download/community).
- Docker installed and running on your machine. You can download it from [here](https://www.docker.com/products/docker-desktop).

## Installation

To install this project, follow these steps:

1. **Clone the repository:** 

    ```
    git clone https://github.com/doomrt88/js-it_support_system.git
    ```

2. **Navigate to the project directory:** 

    ```
    cd js-it_support_system
    ```

3. **Install dependencies:** 

    ```
    cd frontend
    npm install

    cd ../server
    npm install
    ```

4. **Run the mongodb script in mongosh to create the database and seed** 

## Usage

To run the application, follow these steps:

1. **Start the Node.js server: Change directory to server folder** 

    ```
    cd server
    npm start
    ```

2. **Open a new terminal or command prompt, navigate to the frontend directory, and start the React frontend:** 

    ```
    cd frontend
    npm run dev
    ```

3. **Access the application:** 

    Open a web browser and navigate to `http://localhost:5173`.

To run the application with docker, follow these steps:

1. In the terminal run the following

    ```
    update .env file ENABLE_DOCKER=true
    go to the root directory and run
    docker compose -f "docker-compose.yml" up -d --build 
    ```

2. **Access the application:** 

    Open a web browser and navigate to `http://localhost:5173`.

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Node.js web application framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
