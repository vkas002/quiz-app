// src/quiz/quiz.service.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { QuizService } from './quiz.service';
import { Quiz, QuizSchema } from './schema/quiz.schema';
import { Question, QuestionSchema } from './schema/question.schema';
import { Result, ResultSchema } from './schema/result.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

describe('QuizService (Integration)', () => {
  let service: QuizService;
  let mongoServer: MongoMemoryServer;
  const mockQuizModel = {
    findById: jest.fn(),
    create: jest.fn(),  // Mock create method
  };
  

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
        MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
        MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
      ],
      providers: [QuizService],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  describe('createQuiz', () => {
    it('should create a quiz with questions', async () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Sample Quiz',
        questions: [
          { text: 'What is 2 + 2?', options: ['1', '2', '3', '4'], correctOption: 3 },
        ],
      };
  
      const result = await service.createQuiz(createQuizDto);
      
      // Assert only the fields we care about
      expect(result).toMatchObject({
        title: createQuizDto.title,
        questions: [
          { text: 'What is 2 + 2?', options: ['1', '2', '3', '4'], correctOption: 3 },
        ],
      });
    });
  });
  
  

  describe('getQuizById', () => {
    it('should return a quiz by ID', async () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Integration Test Quiz',
        questions: [
          { text: 'What is 2 + 2?', options: ['1', '2', '3', '4'], correctOption: 3 },
        ],
      };

      const createdQuiz = await service.createQuiz(createQuizDto);
      const quiz = await service.getQuizById(createdQuiz._id.toString());

      expect(quiz.title).toBe(createQuizDto.title);
      expect(quiz.questions.length).toBe(1);
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer and update the result', async () => {
      const createQuizDto: CreateQuizDto = {
        title: 'Integration Test Quiz',
        questions: [
          { text: 'What is 2 + 2?', options: ['1', '2', '3', '4'], correctOption: 3 },
        ],
      };

      const createdQuiz = await service.createQuiz(createQuizDto);
      const questionId = createdQuiz.questions[0]._id.toString();

  

      const submitAnswerDto: SubmitAnswerDto = {
        userId: 'user1',
        quizId: createdQuiz._id.toString(),
        questionId : questionId,
        selectedOption: 3,
      };

      const response = await service.submitAnswer(submitAnswerDto);
      expect(response.correct).toBe(true);
    });
  });
});
