import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AzureConfigService } from './azure/azure-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Entering to the app...', process.env.NODE_ENV);

  // Carga las configuraciones de Azure antes de que la app comience a correr
  console.log('Loading Azure variables...');
  const azureConfigService = app.get(AzureConfigService);
  await azureConfigService.loadValuesAppConf();
  console.log('Azure variables loaded.');
  await app.listen(3000);
}
bootstrap();
