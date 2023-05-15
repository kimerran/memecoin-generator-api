import { ethers } from "ethers";
import { NextFunction, Request, Response } from "express"
import { logger } from "../packages/logger/lib";

const verifyEvmSignature = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const signature = authorization ? authorization.split('Signature ')[1] : null;

    // FE signs `walletAddress:email`, retrieve it from the payload
    const { walletAddress, email } = req.body;
    const message = `${walletAddress}:${email}`;

    if (!signature) return res.status(401).json({ msg: 'Signature verification failed' });

    try {
        const recovered = ethers.verifyMessage(message, signature);
        logger.info(`recovered ${recovered}`)

        if (recovered === walletAddress) {
            next();
        } else {
            res.status(401).json({ msg: 'Signature verification failed' });
        }
    } catch (error) {
        console.log('error', error)
        res.status(400).json({ msg: 'failed recovery' })
    }
}

export {
    verifyEvmSignature,
}
