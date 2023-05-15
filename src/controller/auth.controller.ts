import { AppConfig } from "../packages/env-config/lib";
import { Request, Response } from "express"
import { verifyMessage } from "../packages/ethers-utils/signer";
import { createToken } from "../packages/bearer-token/lib";
import { handleExpressError } from "../packages/error-handling/lib";
import { AuthCreateTokenSchema } from "../validation/auth.schema";

const createAuthToken = (appConfig: AppConfig) => async (req: Request, res: Response) => {
    try {
        const parsedPayload = AuthCreateTokenSchema.parse(req.body);
        const { wallet, signature } = parsedPayload;

        const recoverd = verifyMessage(wallet, signature)

        if (recoverd === wallet) {
            // not sure yet what to include in JWT
            const payload = {
                evw: recoverd
            }
            const token = createToken(payload, appConfig);
            res.json({ token });
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