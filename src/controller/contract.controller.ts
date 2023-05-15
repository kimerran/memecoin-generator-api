import { Request, Response } from 'express';
import { AppConfig } from "../packages/env-config/lib";
import { CoinCreateSchema, CoinUpdateSchema } from '../validation/coin.schema';
import { handleExpressError } from '../packages/error-handling/lib';
import { contractDeploy } from '../packages/contract-deployer/lib';

const createCoin = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;

    try {
        const requestPayload = req.body;
        requestPayload.creatorId = Number(res.locals.user.id);

        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>',requestPayload)
        const parsedPayload = CoinCreateSchema.parse(requestPayload);
        const result = await prisma.coinInstance.create({ data: parsedPayload });
        res.json(result);
    } catch (error) {
        return handleExpressError(error, res);
    }
}

const updateCoin = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;
    const { id } = req.params;


    // check if owned by the user
    const matchingCoin = await prisma.coinInstance.findFirst({
        where: {
            id: Number(id),
            creatorId: Number(res.locals.user.id)
        }
    });

    if (!matchingCoin) return res.status(401).json({ msg: 'Unauthorized' })
    if (matchingCoin.status !== 'draft') return res.status(400).json({ msg: 'Unable to modify' })

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

const deployCoinContract = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;
    const { id } = req.params;

    // check if owned by the user
    const matchingCoin = await prisma.coinInstance.findFirst({
        where: {
            id: Number(id),
            creatorId: Number(res.locals.user.id)
        }
    });

    if (!matchingCoin) return res.status(401).json({ msg: 'Unauthorized' })
    try {
        const result = await prisma.coinInstance.findFirst({ where: { id: Number(id) } })
        if (result && result.status === 'draft') {
            const { contractAddress } = await contractDeploy(appConfig, result, res.locals.user);

            await prisma.coinInstance.update({
                where: {
                    id: Number(id)
                },
                data: {
                    contractAddress: contractAddress,
                    status: 'deploy_pushing',
                }
            })

            res.json({ contractAddress });

        } else {
            res.status(404).json({ msg: 'Coin not found' });
        }
    } catch (error) {
        handleExpressError(error, res);
    }
}

export {
    createCoin,
    updateCoin,
    deployCoinContract,
}