import { Prisma } from "@prisma/client";
import { Response } from "express";
import { ZodError } from "zod";

const handleExpressError = (error: any, res: Response) => {
    if (error instanceof ZodError) {
        console.error('error:handleExpressError:validation', error);
        res.status(400).json(error);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ msg: error?.meta?.cause });
    } else {
        console.error('error:handleExpressError', error);
        res.status(500).json('Unhandled')
    }
}
export {
    handleExpressError,
}