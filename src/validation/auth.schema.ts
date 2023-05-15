import { z } from 'zod';

export const AuthCreateTokenSchema = z.object({
    wallet: z.string(),
    signature: z.string(),
});