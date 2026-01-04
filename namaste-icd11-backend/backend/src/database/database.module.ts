import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FhirResource,
  FhirResourceSchema,
} from './fhir-resource.schema';
import { FhirRepository } from './fhir.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FhirResource.name, schema: FhirResourceSchema },
    ]),
  ],
  providers: [FhirRepository],
  exports: [FhirRepository],
})
export class DatabaseModule {}
