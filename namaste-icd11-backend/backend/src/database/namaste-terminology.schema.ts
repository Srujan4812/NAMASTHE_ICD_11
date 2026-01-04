import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'namaste_terminology' })
export class NamasteTerminology extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  display: string;

  @Prop()
  definition?: string;

  @Prop()
  synonyms?: string;

  @Prop()
  category?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NamasteTerminologySchema = SchemaFactory.createForClass(NamasteTerminology);