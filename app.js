require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const passport = require('passport');
const cookieSession = require('cookie-session');
// imports
const { logger } = require('./src/utils');
const indexRoutes = require('./src/routes');
const { HELPER } = require('./src/helpers');
const swaggerDocs = require('./src/utils/swagger');

// express servers
const app = express();

app.use(
    cookieSession({
        name: 'test-auth',
        keys: ['key1', 'key2'],
    })
);

app.use(passport.initialize());
app.use(passport.session());

// mongoose connection

app.use(express.json());
app.use(express.urlencoded({ extended: true, parameterLimit: 1000000 }));
app.use(compression());
app.use(cookieParser());

app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204,
    })
);

app.use(helmet());
app.use(morgan('[:date[web]] :method :url :status :response-time ms - :res[content-length]'));

// Enabled CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

// Public Path
const publicPath = path.join(__dirname, 'src/public');
app.use(express.static(publicPath));

// api Routes
app.use('/api', indexRoutes);

// swagger docs
swaggerDocs(app, process.env.PORT);

// errorHandler
app.use(HELPER.errorHandler);

// routesHandler
app.use(HELPER.routeHandler);

// handle exceptions
process.on('uncaughtException', function (err) {
    logger.error(err);
});

// dev server

// handle rejection
process.on('unhandledRejection', function (err) {
    logger.error(err);
});

module.exports = app;
