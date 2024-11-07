// src/quiz/schemas/quiz.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Question } from './question.schema';

@Schema()
export class Quiz extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] }) // Reference Question model
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
