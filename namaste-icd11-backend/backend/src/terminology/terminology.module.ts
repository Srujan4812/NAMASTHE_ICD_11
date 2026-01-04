import { Module } from '@nestjs/common';
import { TerminologyController } from './terminology.controller';
import { TerminologyService } from './terminology.service';
import { ConceptMapController } from './conceptmap.controller';
import { ConceptMapService } from './conceptmap.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule, // DB-first terminology access
  ],
  controllers: [
    TerminologyController,
    ConceptMapController,
  ],
  providers: [
    TerminologyService,
    ConceptMapService,
  ],
  exports: [
    ConceptMapService, // 👈 REQUIRED for BundleModule DI
  ],
})
export class TerminologyModule {}
