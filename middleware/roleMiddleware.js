const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            const error = new Error('Forbidden');
            error.status = 403;
            return next(error);
        }
        next();
    };
};

export default authorize;