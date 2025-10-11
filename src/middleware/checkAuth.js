
module.exports = (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        return next();
    } else {
        const error = res.status(401).json({ error: 'Unauthorized, please login to access this resource' });
        return error;
    }
};