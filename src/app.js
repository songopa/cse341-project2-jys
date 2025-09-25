require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { connectToDb } = require('./database/db');
const userRoutes = require('./routes/users');
const carRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const swaggerRoute = require('./routes/swagger');
const path = require('path');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, '../public')));


// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.HTTPS || true }
}));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/api-docs', swaggerRoute);
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;
connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
