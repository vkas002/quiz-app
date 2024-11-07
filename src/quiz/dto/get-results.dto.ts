// src/quiz/dto/get-results.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class GetResultsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  quizId: string;
}
