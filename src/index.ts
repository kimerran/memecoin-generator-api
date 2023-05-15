import { getAppConfig } from './packages/env-config/lib'
import { logger } from './packages/logger/lib';
import { initServer } from './server';
async function main () {
    const config = getAppConfig()
    const server = initServer(config);

    server.listen(config.port, () => {
        logger.info(`server listening at http://localhost:${config.port}`)
    });
}

main();
