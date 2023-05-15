import { z } from 'zod';

export const AccountCreateSchema = z.object({
    email: z.string(),
    mobile: z.string().optional(),
    twitter: z.string().optional(),
    walletAddress: z.string(),
});