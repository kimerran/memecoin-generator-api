import { NextFunction, Request, Response } from "express"
import { verifyToken } from "../packages/bearer-token/lib";
import { AppConfig } from "../packages/env-config/lib";
import { handleExpressError } from "../packages/error-handling/lib";


type JwtAuthPayload = {
    evw: string
}

const verifyJwtAuth = (appConfig: AppConfig) => async (req: Request, res: Response, next: NextFunction) => {
    const { prisma } = appConfig;
    const { authorization } = req.headers;
    const token = authorization ? authorization.split('Bearer ')[1] : null;

    if (!token) return res.status(401).json({ msg: 'Unauthorized' });

    try {
        const payload = verifyToken(token, appConfig) as JwtAuthPayload;

        const userMatch = await prisma.account.findFirst({ where: {
            walletAddress: payload.evw
        }})

        if (userMatch) {
            console.log('user match', userMatch);
            res.locals.user = userMatch;
        } else {
            return res.status(401).json({ msg: 'Unauthorized' });
        }


        next();
        // payload
    } catch (error) {
        return handleExpressError(error, res);
    }


}

export {
    verifyJwtAuth,
}