import { Request, Response } from 'express';
import { ZodError, z } from 'zod';

import { AppConfig } from "../packages/env-config/lib";
import { AccountCreateSchema } from '../validation/account.schema';
import { handleExpressError } from '../packages/error-handling/lib';

const createAccount = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;

    try {
        const parsedPayload = AccountCreateSchema.parse(req.body);
        const newUser = await prisma.account.create({
            data: parsedPayload
        });

        res.json(newUser);
    } catch (error) {
        return handleExpressError(error, res);
    }
}

export {
    createAccount,
}