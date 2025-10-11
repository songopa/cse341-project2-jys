const { requiresAuth } = require('express-openid-connect');

exports.checkAuth = async (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};