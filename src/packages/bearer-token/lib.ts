import assert from 'assert';
import jwt from 'jsonwebtoken';
import { AppConfig } from '../env-config/lib';

const createToken = (payload: any, appConfig: AppConfig) => {
    assert(appConfig.jwt.secret, '');
    return jwt.sign({
        ...payload,
    }, appConfig.jwt.secret, {
        expiresIn: appConfig.jwt.expireInSeconds
    })
}

const verifyToken = (token: string, appConfig: AppConfig) => {
    return jwt.verify(token, appConfig.jwt.secret);
}

export {
    createToken,
    verifyToken,
}