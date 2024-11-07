// src/quiz/dto/submit-answer.dto.ts
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsInt()
  selectedOption: number;
}
