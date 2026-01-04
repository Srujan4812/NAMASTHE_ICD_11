import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FhirController } from './fhir.controller';
import { FhirService } from './fhir.service';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [FhirController],
  providers: [FhirService],
})
export class FhirModule {}
