// src/quiz/quiz.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { Quiz } from './schema/quiz.schema';
import { Question } from './schema/question.schema';
import { Result } from './schema/result.schema';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(Result.name) private resultModel: Model<Result>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const questions = await this.questionModel.insertMany(createQuizDto.questions);
    return this.quizModel.create({ title: createQuizDto.title, questions });
  }
  

  async getQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizModel
      .findById(id)
      .populate({
        path: 'questions',
        model: 'Question',           // Specify model explicitly to be certain
        select: '-correctOption',     // Exclude `correctOption`
        options: { lean: true },      // Improve performance and ensure plain objects
      })
      .exec();
  
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { userId, quizId, questionId, selectedOption } = submitAnswerDto;
  
    // Find the question to check the correct answer
    const question = await this.questionModel.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
  
    const isCorrect = question.correctOption === selectedOption;
  
    // Upsert (update or insert) user's result for this quiz
    await this.resultModel.updateOne(
      { quizId, userId },
      {
        $push: {
          answers: { questionId, selectedOption, isCorrect },
        },
        $inc: { score: isCorrect ? 1 : 0 },
      },
      { upsert: true }
    );
  
    return { correct: isCorrect, correctOption: question.correctOption };
  }
  

  async getResults(quizId: string, userId: string) {
    const result = await this.resultModel.findOne({ quizId, userId });
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return result;
  }
}
