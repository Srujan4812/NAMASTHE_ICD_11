import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TerminologyModule } from './terminology/terminology.module';
import { FhirModule } from './fhir/fhir.module';
import { DatabaseModule } from './database/database.module';
import { BundleModule } from './bundle/bundle.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Ensure MONGODB_URI is set
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is not set');
  process.exit(1);
}

@Module({
  imports: [
    BundleModule,
    MongooseModule.forRoot(process.env.MONGODB_URI), // Use environment variable
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    FhirModule,
    TerminologyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}