require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectToDb } = require('./database/db');
const userRoutes = require('./routes/users');
const carRoutes = require('./routes/cars');
const profileRoutes = require('./routes/profile');
const swaggerRoute = require('./routes/swagger');
const path = require('path');
const app = express();
const { auth } = require('express-openid-connect');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));


// Session middleware
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction, // set secure cookies in production
        sameSite: isProduction ? 'none' : 'lax',
        httpOnly: true
    }
}));



// Auth0 configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};
app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
});



// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/api-docs', swaggerRoute);
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/profile', profileRoutes);

const port = process.env.PORT || 3000;
connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal Server Error' });
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV !== 'production' ? err : {}
    });
});
