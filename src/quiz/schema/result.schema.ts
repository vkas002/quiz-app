// src/quiz/schemas/result.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Answer {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  selectedOption: number;

  @Prop({ required: true })
  isCorrect: boolean;
}

@Schema()
export class Result extends Document {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  score: number;

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);
