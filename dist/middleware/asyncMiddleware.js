export const asyncMiddleware = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=asyncMiddleware.js.map