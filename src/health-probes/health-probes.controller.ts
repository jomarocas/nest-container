import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ProbesController {
    constructor(
        private readonly configService: ConfigService,
        // Aquí puedes inyectar otros servicios que necesites para la verificación de readiness, etc.
        // private readonly casperService: CasperService,
        // private readonly suscripcionesService: SuscripcionesService,
    ) { }

    @Get('/liveness')
    @Header('Custom-Header', 'liveness probe')
    @HttpCode(200)
    livenessProbe() {
        const name = this.configService.get<string>('app.name');
        console.log('name', name)
        const version = this.configService.get<string>('app.version');
        const description = this.configService.get<string>('app.description');
        const environment = this.configService.get<string>('NODE_ENV');
        const date = new Date().toISOString();

        return {
            greeting: `Liveness Probe from ${description}`,
            environment,
            version: `${name}.v.${version}`,
            date,
        };
    }

    @Get('/startup')
    @Header('Custom-Header', 'startup probe')
    @HttpCode(200)
    startupProbe() {
        const version = this.configService.get<string>('KeyVaultName');
        const description = process.env.KeyVaultName;
        const date = new Date().toISOString();

        return {
            greeting: `Startup Probe from ${description}`,
            version: `v.${version}`,
            date,
        };
    }

    @Get('/readiness')
    @HttpCode(200)
    async readinessProbe() {
        let casper = {
            name: 'casper',
            status: 'UNKNOWN',
            detail: 'Something is wrong with service readiness probe',
        };
        let suscripciones = {
            name: 'suscripciones',
            status: 'UNKNOWN',
            detail: 'Something is wrong with service readiness probe',
        };

        let statusCode = 500;
        let status = 'UNHEALTHY';

        try {
            // Llamada al servicio real de casper, cuando esté listo
            // const casperService = await this.casperService.findOne(...);
            // Simulación:
            const casperService = true;

            if (casperService) {
                casper = {
                    name: 'casper',
                    status: 'HEALTHY',
                    detail: '1 item found',
                };
            }
        } catch (error) {
            console.error('casper', error);
            casper = {
                name: 'casper',
                status: 'UNHEALTHY',
                detail: 'Something is wrong with the detail service ' + error,
            };
        }

        try {
            // Llamada al servicio real de suscripciones, cuando esté listo
            // const suscripcionesService = await this.suscripcionesService.findOne(...);
            // Simulación:
            const suscripcionesService = true;

            if (suscripcionesService) {
                suscripciones = {
                    name: 'suscripciones',
                    status: 'HEALTHY',
                    detail: '1 item found',
                };
            }
        } catch (error) {
            console.error('suscripciones', error);
            suscripciones = {
                name: 'suscripciones',
                status: 'UNHEALTHY',
                detail: 'Something is wrong with the detail service ' + error,
            };
        }

        const services = [casper, suscripciones];
        const ifdegrade = services.find(x => x.status === 'DEGRADED');
        const ifunhealthy = services.find(x => x.status === 'UNHEALTHY');

        if (ifdegrade && !ifunhealthy) {
            statusCode = 200;
            status = 'DEGRADED';
        } else if (ifunhealthy) {
            statusCode = 500;
            status = 'UNHEALTHY';
        } else {
            statusCode = 200;
            status = 'HEALTHY';
        }

        return {
            statusCode,
            status,
            'main services': [casper, suscripciones],
            'secondary services': [],
        };
    }
}
