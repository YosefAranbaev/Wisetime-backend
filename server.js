const express = require('express');
const cors = require('cors');

const { taskRouter } = require('./routers/taskRouter');
const { constraintRouter } = require('./routers/constraintRouter');
const { categoryRouter } = require('./routers/categoryRouter');
const { userRouter } = require('./routers/userRouter');
const { authRouter } = require('./routers/authRouter');
const { verifyToken } = require('./middleware/authJwt');

const app = express();
const port = process.env.PORT || 8080;

// if(process.env.ENV === 'development') {
    const logger = require('morgan');
    app.use(logger('dev'));
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/auth', authRouter);

// app.use(verifyToken);
app.use('/api/validate', (req, res) => res.status(200).json({'success': 'Access Token is valid'}));

app.use('/api/users/:userId/tasks', (req, res, next) => {
    req.userId = req.params.userId;
    next();
}, taskRouter);

app.use('/api/users/:userId/constraints', (req, res, next) => {
    req.userId = req.params.userId;
    next();
}, constraintRouter);

app.use('/api/users/:userId/categories', (req, res, next) => {
    req.userId = req.params.userId;
    next();
}, categoryRouter);

app.use('/api/users', userRouter);

app.use('*', (req, res) => {
    res.status(404).json({'error': 'Page Not Found'});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});