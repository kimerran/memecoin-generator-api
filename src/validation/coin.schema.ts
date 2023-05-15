import { z } from 'zod';

export const CoinCreateSchema = z.object({
    creatorId: z.number().default(5),
    imageUrl: z.string().optional(),
    name: z.string(),
    symbol: z.string(),
    status: z.string().default("draft"),
});

export const CoinUpdateSchema = z.object({
    imageUrl: z.string().optional(),
    name: z.string().optional(),
    symbol: z.string().optional(),
    status: z.string().optional(),
});
