const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const router = express.Router();

router.get('/', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

module.exports = router;