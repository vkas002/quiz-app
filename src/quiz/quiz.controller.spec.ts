// src/quiz/quiz.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

describe('QuizController', () => {
  let controller: QuizController;
  let service: QuizService;

  const mockQuizService = {
    createQuiz: jest.fn(),
    getQuizById: jest.fn(),
    submitAnswer: jest.fn(),
    getResults: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: mockQuizService,
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    service = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createQuiz', () => {
    it('should create a new quiz', async () => {
      const createQuizDto: CreateQuizDto = { title: 'Sample Quiz', questions: [] };
      const createdQuiz = { id: '123', ...createQuizDto };
      
      mockQuizService.createQuiz.mockResolvedValue(createdQuiz);

      expect(await controller.createQuiz(createQuizDto)).toEqual(createdQuiz);
      expect(mockQuizService.createQuiz).toHaveBeenCalledWith(createQuizDto);
    });
  });

  describe('getQuiz', () => {
    it('should return a quiz by id', async () => {
      const quiz = { id: '123', title: 'Sample Quiz', questions: [] };
      mockQuizService.getQuizById.mockResolvedValue(quiz);

      expect(await controller.getQuiz('123')).toEqual(quiz);
      expect(mockQuizService.getQuizById).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if quiz not found', async () => {
      mockQuizService.getQuizById.mockResolvedValue(null);

      await expect(controller.getQuiz('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer and return feedback', async () => {
      const submitAnswerDto: SubmitAnswerDto = {
        userId: 'user1',
        quizId: 'quiz1',
        questionId: 'q1', selectedOption: 2,
      };
      const feedback = { correct: true, correctOption: 2 };

      mockQuizService.submitAnswer.mockResolvedValue(feedback);

      expect(await controller.submitAnswer(submitAnswerDto)).toEqual(feedback);
      expect(mockQuizService.submitAnswer).toHaveBeenCalledWith(submitAnswerDto);
    });
  });

  describe('getResults', () => {
    it('should return results for a user and quiz', async () => {
      const results = { quizId: 'quiz1', userId: 'user1', score: 3 };
      mockQuizService.getResults.mockResolvedValue(results);

      expect(await controller.getResults('quiz1', 'user1')).toEqual(results);
      expect(mockQuizService.getResults).toHaveBeenCalledWith('quiz1', 'user1');
    });
  });
});
