import { Module } from '@nestjs/common';
import { TerminologyService } from './terminology.service';
import { TerminologyController } from './terminology.controller';
import { ConceptMapService } from './conceptmap.service';
import { ConceptMapController } from './conceptmap.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TerminologyService, ConceptMapService],
  controllers: [TerminologyController, ConceptMapController],
  exports: [ConceptMapService], // Required for BundleModule DI
})
export class TerminologyModule {}