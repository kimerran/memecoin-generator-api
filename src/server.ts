import express, { Request, Response } from 'express';
import { AppConfig } from './packages/env-config/lib';
import { createAccount } from './controller/account.controller';
import bodyParser from 'body-parser';
import { createCoin, updateCoin } from './controller/contract.controller';


const initServer = (appConfig: AppConfig) => {

    const app = express();
    app.disable('x-powered-by')
    app.use(bodyParser.json())


    app.post('/account', createAccount(appConfig));
    
    app.post('/coin', createCoin(appConfig));
    app.patch('/coin/:id', updateCoin(appConfig));
    return app;
}

export {
    initServer,
}