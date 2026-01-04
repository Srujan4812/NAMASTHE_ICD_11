import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'fhir_resources' })
export class FhirResource extends Document {

  @Prop({ required: true })
  resourceType: string;

  @Prop({ required: true })
  resourceId: string;

  @Prop({ required: true })
  versionId: string;

  @Prop()
  status?: string;

  @Prop()
  lastUpdated?: string;

  @Prop({ type: Object, required: true })
  resource: any;
}

export const FhirResourceSchema =
  SchemaFactory.createForClass(FhirResource);
