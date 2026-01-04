import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FhirRepository } from './fhir.repository';
import { NamasteRepository } from './namaste.repository';
import { FhirResource, FhirResourceSchema } from './fhir-resource.schema';
import { NamasteTerminology, NamasteTerminologySchema } from './namaste-terminology.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FhirResource.name, schema: FhirResourceSchema },
      { name: NamasteTerminology.name, schema: NamasteTerminologySchema },
    ]),
  ],
  providers: [FhirRepository, NamasteRepository],
  exports: [FhirRepository, NamasteRepository],
})
export class DatabaseModule {}