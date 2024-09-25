import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProbesController } from './health-probes.controller';

@Module({
    imports: [ConfigModule],
    controllers: [ProbesController]
})
export class HealthProbesModule { }
