require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const msal = require('@azure/msal-node');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { indexRouter } = require('./routers/indexRouter');
const { authRouter } = require('./routers/authRouter');
const { calendarRouter } = require('./routers/calendarRouter');
const { scheduleRouter } = require('./routers/scheduleRouter');
const { msalConfig } = require('./config');
const { taskRouter } = require('./routers/taskRouter');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
require('./db_connection');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://http://127.0.0.1:5500/');
    res.header("Access-Control-Allow-Credentials: true");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(cookieParser());

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

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/tasks', taskRouter);


app.use('*', (req, res) => {
    res.status(404).json({'error': 'Page Not Found'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});