import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';
import { AppConfigurationClient } from '@azure/app-configuration';
import { ConfigService } from '@nestjs/config';
import * as packageJson from '../../package.json';

@Injectable()
export class AzureConfigService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService
    ) { }
    private readonly logger = new Logger(AzureConfigService.name);
    async onModuleInit() {
        if (process.env.NODE_ENV === 'production') {
            console.log('Loading Azure variables...');
            await this.loadValuesAppConf();  // Cargar las configuraciones de Azure
            console.log('Azure variables loaded.', process.env.KeyVaultName);
        }
    }

    async loadValuesAppConf() {
        const name = packageJson.name;
        const endpointAppConfiguration = process.env.appconfiguration;
        if (!endpointAppConfiguration) {
            throw new Error(`AppConfiguration endpoint is not defined, define for beta with command 'export appconfiguration=https://**.azconfig.io'`);
        }
        const credential = new DefaultAzureCredential();
        const clientAppConfiguration = new AppConfigurationClient(endpointAppConfiguration, credential);

        try {
            const filteredSettingsList = clientAppConfiguration.listConfigurationSettings({
                keyFilter: `${name}*`,
            });

            for await (const settingProperties of filteredSettingsList) {
                const setting = await clientAppConfiguration.getConfigurationSetting({ key: settingProperties.key });
                const namekey = setting.key.replace(`${name}`, '');
                const value = setting.value;
                process.env[namekey] = value;
            }

            const keyVaultName = process.env.KeyVaultName;
            const url = `https://${keyVaultName}.vault.azure.net`;

            const clientAzure = new SecretClient(url, credential);
            await this.loadValuesVault(clientAzure);
        } catch (error) {
            this.logger.error('Error loading AppConfig settings', error);
        }
    }

    private async loadValuesVault(clientAzure: SecretClient) {
        const name = packageJson.name;

        try {
            for await (const secretProperties of clientAzure.listPropertiesOfSecrets()) {
                const secret = await clientAzure.getSecret(secretProperties.name);
                const namekey = secret.name.replace(`${name}`, '');
                const value = secret.value;
                process.env[namekey] = value;
            }
        } catch (error) {
            this.logger.error('Error loading secrets from KeyVault', error);
        }
    }
}
