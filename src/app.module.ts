import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureConfigService } from './azure/azure-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),  // ConfigModule para procesar variables de entorno
  ],
  providers: [AzureConfigService],
})
export class AppModule {
  constructor(private readonly azureConfigService: AzureConfigService) {
    this.azureConfigService.loadValuesAppConf();  // Cargar las configuraciones al iniciar la app
  }
}