import { AppConfig } from "../packages/env-config/lib";
import { Request, Response } from "express"
import { verifyMessage } from "../packages/ethers-utils/signer";
import { createToken } from "../packages/bearer-token/lib";
import { handleExpressError } from "../packages/error-handling/lib";
import { AuthCreateTokenSchema } from "../validation/auth.schema";

const createAuthToken = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    const { prisma } = appConfig;

    try {
        const parsedPayload = AuthCreateTokenSchema.parse(req.body);
        const { wallet, signature } = parsedPayload;

        const recoverd = verifyMessage(wallet, signature)

        if (recoverd === wallet) {
            // verify if this exists in the DB
            const match = await prisma.account.findFirst({
                where: {
                    walletAddress: recoverd
                }
            })

            if (match) {
                // not sure yet what to include in JWT
                const payload = {
                    evw: recoverd
                }
                const token = createToken(payload, appConfig);
                res.json({ token });
            } else {
                return res.status(401).json({ msg: 'Unauthorized' })
            }


        } else {
            res.status(401).json({ msg: 'Signature verification failed' });
        }

    } catch (error) {
        return handleExpressError(error, res);
    }
}

export {
    createAuthToken,
}