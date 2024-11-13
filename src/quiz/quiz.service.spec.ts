import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Quiz } from './schema/quiz.schema';
import { Question } from './schema/question.schema';
import { Result } from './schema/result.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';

describe('QuizService', () => {
  let service: QuizService;

  const mockQuestionModel = {
    insertMany: jest.fn(),
  };

  const mockResultModel = {
    updateOne: jest.fn(),
    findOne: jest.fn(),
  };

  // Define the mockQuizModel with findById as a Jest mock function
  const mockQuizModel = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        { provide: getModelToken(Quiz.name), useValue: mockQuizModel },
        { provide: getModelToken(Question.name), useValue: mockQuestionModel },
        { provide: getModelToken(Result.name), useValue: mockResultModel },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  describe('getQuizById', () => {
    it('should return a quiz if found', async () => {
      const quizId = 'quizId';
      const quiz = { _id: quizId, title: 'Sample Quiz', questions: [] };

      // Mocking the findById chain with populate and exec
      mockQuizModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(quiz),
        }),
      });

      const result = await service.getQuizById(quizId);
      expect(result).toEqual(quiz);
      expect(mockQuizModel.findById).toHaveBeenCalledWith(quizId);
    });

    it('should throw NotFoundException if quiz not found', async () => {
      // Mocking findById to return a null result in exec
      mockQuizModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.getQuizById('invalidId')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockQuizModel.findById).toHaveBeenCalledWith('invalidId');
    });
  });

  describe('getResults', () => {
    it('should return results if found', async () => {
      const results = { quizId: 'quiz1', userId: 'user1', score: 2 };
      mockResultModel.findOne.mockResolvedValue(results);

      const result = await service.getResults('quiz1', 'user1');
      expect(result).toEqual(results);
    });

    it('should throw NotFoundException if results not found', async () => {
      mockResultModel.findOne.mockResolvedValue(null);

      await expect(service.getResults('quiz1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
