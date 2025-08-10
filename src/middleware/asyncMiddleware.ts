export const asyncMiddleware = (handler: any) => {
    return async (req: any, res: any, next: any) => {
        try {
           await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}