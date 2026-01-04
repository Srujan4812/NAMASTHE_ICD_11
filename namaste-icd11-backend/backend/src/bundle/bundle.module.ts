import { Module } from '@nestjs/common';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { TerminologyModule } from '../terminology/terminology.module';

@Module({
  imports: [
    TerminologyModule,
  ],
  controllers: [BundleController],
  providers: [BundleService],
})
export class BundleModule {}