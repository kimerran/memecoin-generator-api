import { Request, Response } from 'express';
import { AppConfig } from "../packages/env-config/lib";
import { ZodError, z } from 'zod';
import { CoinCreateSchema, CoinUpdateSchema } from '../validation/coin.schema';
import { Prisma } from '@prisma/client';
import { handleExpressError } from '../packages/error-handling/lib';


const createCoin = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;

    try {
        const parsedPayload = CoinCreateSchema.parse(req.body);
        const result = await prisma.coinInstance.create({ data: parsedPayload });
        res.json(result);
    } catch (error) {
        return handleExpressError(error, res);
    }
}

const updateCoin = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;
    const { id } = req.params;

    try {
        const parsedPayload = CoinUpdateSchema.parse({ ...req.body });
        const result = await prisma.coinInstance.update({
            where: {
                id: Number(id)
            },
            data: parsedPayload
        })
        res.json(result)

    } catch (error) {
        return handleExpressError(error, res);
    }
}

export {
    createCoin,
    updateCoin,
}