// src/quiz/quiz.controller.ts

import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    NotFoundException,
  } from '@nestjs/common';
  import { QuizService } from './quiz.service';
  import { CreateQuizDto } from './dto/create-quiz.dto';
  import { SubmitAnswerDto } from './dto/submit-answer.dto';
  import { GetResultsDto } from './dto/get-results.dto';
import { ApiBody } from '@nestjs/swagger';
  
  @Controller('quiz')
  export class QuizController {
    constructor(private readonly quizService: QuizService) {}
  
    @Post()
    @ApiBody({ type: CreateQuizDto })
    async createQuiz(@Body() createQuizDto: CreateQuizDto) {
      return this.quizService.createQuiz(createQuizDto);
    }
  
    @Get(':id')
    async getQuiz(@Param('id') id: string) {
      const quiz = await this.quizService.getQuizById(id);
      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }
      return quiz;
    }
  
    @Post('/submit')
    @ApiBody({ type: SubmitAnswerDto })
    async submitAnswer(
      @Body() submitAnswerDto: SubmitAnswerDto,
    ) {
      return this.quizService.submitAnswer(submitAnswerDto);
    }
  
    @Get(':quizId/:userId/results')
    async getResults(
      @Param('quizId') quizId: string,
      @Param('userId') userId: string,
    ) {
      return this.quizService.getResults(quizId, userId);
    }
  }
  