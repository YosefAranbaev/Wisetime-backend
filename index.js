require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const msal = require('@azure/msal-node');
const logger = require('morgan');

const { indexRouter } = require('./routers/indexRouter');
const { authRouter } = require('./routers/authRouter');
const { calendarRouter } = require('./routers/calendarRouter');
const { msalConfig } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.locals.users = {};
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
}));

app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.user = app.locals.users[req.session.userId];
    }
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/calendar', calendarRouter);

app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});