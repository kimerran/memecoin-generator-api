require('dotenv').config();
import assert from "assert";
import { PrismaClient } from '@prisma/client'

export type AppConfig = {
    port: number,
    db: {
        database: string,
        username: string,
        password: string,
        host: string,
        port: number,
        url: string,
    },
    aws?: {
        accessKeyId?: string,
        secretAccessKey?: string,
    },
    prisma: PrismaClient,
}

const getAppConfig = () : AppConfig => {
    // assert all required app config
    assert(process.env.PG_DATABASE, `AppConfig 'PG_DATABASE' is missing in environment variables`);
    assert(process.env.PG_USERNAME, `AppConfig 'PG_USERNAME' is missing in environment variables`);
    assert(process.env.PG_PASSWORD, `AppConfig 'PG_PASSWORD' is missing in environment variables`);
    assert(process.env.PG_HOST, `AppConfig 'PG_HOST' is missing in environment variables`);
    assert(process.env.PG_PORT, `AppConfig 'PG_PORT' is missing in environment variables`);
    assert(process.env.DATABASE_URL, `AppConfig 'DATABASE_URL' is missing in environment variables`);
    const prisma = new PrismaClient()

    return {
        port: Number(process.env.APP_PORT) || 8080,
        db: {
            database: process.env.PG_DATABASE,
            username: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            host: process.env.PG_HOST,
            port: Number(process.env.PG_PORT),
            url: process.env.DATABASE_URL,
        },
        aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        prisma
    }
}

export {
    getAppConfig,
}