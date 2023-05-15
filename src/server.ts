import express, { Request, Response } from 'express';
import { AppConfig } from './packages/env-config/lib';
import { createAccount } from './controller/account.controller';
import bodyParser from 'body-parser';
import { createCoin, deployCoinContract, updateCoin } from './controller/contract.controller';
import { verifyEvmSignature } from './middleware/verifyEvmSignature.middleware';
import { createAuthToken } from './controller/auth.controller';
import { verifyJwtAuth } from './middleware/verifyJwtAuth.middleware';


const initServer = (appConfig: AppConfig) => {

    const app = express();
    app.disable('x-powered-by')
    app.use(bodyParser.json())

    app.post('/account', verifyEvmSignature, createAccount(appConfig));
    app.post('/account/login', createAuthToken(appConfig));

    app.post('/coin', verifyJwtAuth(appConfig), createCoin(appConfig));
    app.patch('/coin/:id', verifyJwtAuth(appConfig), updateCoin(appConfig));
    app.post('/coin/:id/deploy', verifyJwtAuth(appConfig), deployCoinContract(appConfig));
    return app;
}

export {
    initServer,
}