import { ZodError } from "zod";    

export const errorHandler = (err: any, req: any, res: any, next: any) => {
    if (err instanceof ZodError) {
        return res.status(400).json({ error: err.issues[0]?.message || "Validation error" });
    }

    res.status(500).json({ error: err.message || "Internal Server Error" });
}