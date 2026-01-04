import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TerminologyModule } from './terminology/terminology.module';
import { FhirModule } from './fhir/fhir.module';
import { BundleModule } from './bundle/bundle.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    BundleModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    FhirModule,
    TerminologyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}