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

// Optional: Only connect to MongoDB if needed for other purposes (like bundles)
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/namaste';

@Module({
  imports: [
    BundleModule,
    MongooseModule.forRoot(mongoUri), // Use environment variable
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