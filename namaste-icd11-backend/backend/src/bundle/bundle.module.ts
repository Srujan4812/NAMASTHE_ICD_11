import { Module } from '@nestjs/common';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { TerminologyModule } from '../terminology/terminology.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    TerminologyModule,
    DatabaseModule, // 👈 THIS IS NON-NEGOTIABLE
  ],
  controllers: [BundleController],
  providers: [BundleService],
})
export class BundleModule {}
