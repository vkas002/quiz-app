// src/quiz/quiz.controller.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { QuizModule } from './quiz.module';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('QuizController (Integration)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), QuizModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('/quiz (POST)', () => {
    it('should create a new quiz', async () => {
      const createQuizDto = {
        title: 'Sample Quiz',
        questions: [
          {
            text: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            correctOption: 3,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/quiz')
        .send(createQuizDto)
        .expect(201);

      expect(response.body.title).toBe(createQuizDto.title);
    });
  });

  describe('/quiz/:id (GET)', () => {
    it('should get a quiz by ID', async () => {
      const createQuizResponse = await request(app.getHttpServer())
        .post('/quiz')
        .send({
          title: 'Sample Quiz',
          questions: [
            {
              text: 'What is 2 + 2?',
              options: ['1', '2', '3', '4'],
              correctOption: 3,
            },
          ],
        });

      const quizId = createQuizResponse.body._id;

      const response = await request(app.getHttpServer())
        .get(`/quiz/${quizId}`)
        .expect(200);

      expect(response.body._id).toBe(quizId);
      expect(response.body.title).toBe('Sample Quiz');
    });
  });

  describe('/quiz/submit (POST)', () => {
    it('should submit an answer and return feedback', async () => {
      const createQuizResponse = await request(app.getHttpServer())
        .post('/quiz')
        .send({
          title: 'Sample Quiz',
          questions: [
            {
              text: 'What is 2 + 2?',
              options: ['1', '2', '3', '4'],
              correctOption: 3,
            },
          ],
        });

      const quizId = createQuizResponse.body._id;
      const submitAnswerDto = {
        userId: 'user1',
        quizId: quizId,
        questionId: createQuizResponse.body.questions[0]._id,
        selectedOption: 3,
      };

      const response = await request(app.getHttpServer())
        .post('/quiz/submit')
        .send(submitAnswerDto)
        .expect(201);

      expect(response.body.correct).toBe(true);
      expect(response.body.correctOption).toBe(3);
    });
  });
});