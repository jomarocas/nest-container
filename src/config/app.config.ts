import { registerAs } from '@nestjs/config';
import * as packageJson from '../../package.json';

export default registerAs('app', () => ({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description
}));