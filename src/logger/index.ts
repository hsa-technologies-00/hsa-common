import { getEnvVariable } from '../utils/env-variable';
import developmentLogger from './development';
import productionLogger from './production';

let logger = developmentLogger;
if (getEnvVariable('NODE_ENV') === 'development') logger = developmentLogger;
if (getEnvVariable('NODE_ENV') === 'production' || getEnvVariable('NODE_ENV') === 'staging') logger = productionLogger;

export { logger };
