<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



# Quiz Application API

A simple RESTful API for creating quizzes, answering questions, and retrieving results. This application is built using **NestJS** and **MongoDB**, with Docker for containerization.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Docker
- Docker Compose

### Project Structure

The project consists of the following containers:
- **quiz-api**: The NestJS API for managing quizzes and responses.
- **quiz-mongo**: MongoDB database to store quiz and result data.
- **quiz-mongo-express**: A MongoDB admin interface.

### Environment Configuration

The environment variables for MongoDB are set directly within the `docker-compose.yml` file. No additional `.env` file is required unless you wish to override these values.

---

## Running the Application

1. **Clone this repository** and navigate to the project root.
2. Run the following command to start the Docker containers:

   ```bash
   docker-compose up -d

3. Once the containers are running, the API will be accessible at http://localhost:53000 and the MongoDB Express UI at http://localhost:58081.


## API Endpoints
1. Create Quiz
Endpoint: POST /quiz

Description: Creates a new quiz with questions and options.
    ```bash
Sample Request:  
{
  "title": "General Knowledge Quiz",
  "questions": [
    {
      "text": "Which planet is known as the Red Planet?",
      "options": ["Earth", "Mars", "Jupiter", "Saturn"],
      "correctOption": 1
    },
    {
      "text": "What is the largest mammal?",
      "options": ["Elephant", "Blue Whale", "Shark", "Giraffe"],
      "correctOption": 1
    }
  ]
}

2. Get Quiz
Endpoint: GET /quiz/:id

Description: Fetches a quiz by its ID without revealing the correct answers.
    ```bash
{
  "_id": "quizId",
  "title": "General Knowledge Quiz",
  "questions": [
    {
      "_id": "questionId1",
      "text": "Which planet is known as the Red Planet?",
      "options": ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      "_id": "questionId2",
      "text": "What is the largest mammal?",
      "options": ["Elephant", "Blue Whale", "Shark", "Giraffe"]
    }
  ]
}

3. Submit Answer
Endpoint: POST /quiz/:quizId/answer

Description: Submits an answer for a specific question and returns feedback.
    ```bash

Sample Request:
{
  "userId": "user123",
  "quizId": "quizId",
  "questionId": "questionId1",
  "selectedOption": 1
}

Sample Response:
{
  "correct": true,
  "correctOption": 1
}


4. Get Results
Endpoint: GET /quiz/:quizId/results?userId=user123

Description: Retrieves the results of a quiz for a specific user.
    ```bash
Sample Response:
{
  "quizId": "quizId",
  "userId": "user123",
  "score": 2,
  "answers": [
    {
      "questionId": "questionId1",
      "selectedOption": 1,
      "isCorrect": true
    },
    {
      "questionId": "questionId2",
      "selectedOption": 2,
      "isCorrect": false
    }
  ]
}


## Swagger API Documentation
The API comes with integrated Swagger documentation. Access it by visiting: http://localhost:53000/api

## Running Tests with Docker
To execute test cases outside of the container, use the following command:
```bash
  docker-compose up quiz-api-test

To execute tests within the Docker container, you can use the following commands:

1. Run all tests:
```bash
  docker-compose exec quiz-api npm run test

2. Run tests in watch mode:
```bash  
  docker-compose exec quiz-api npm run test:watch

3. Run specific test files:
```bash
  docker-compose exec quiz-api npm run test src/quiz/quiz.service.integration.spec.ts

## Stopping the Application
To stop the containers: 
```bash
docker-compose down





