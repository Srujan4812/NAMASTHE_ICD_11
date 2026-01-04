import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FhirRepository } from './fhir.repository';
import { FhirResource, FhirResourceSchema } from './fhir-resource.schema';

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