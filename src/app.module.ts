import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureConfigService } from './azure/azure-config.service';
import { HealthProbesModule } from './health-probes/health-probes.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    HealthProbesModule,
  ],
  providers: [
    AzureConfigService
  ],
})
export class AppModule { }