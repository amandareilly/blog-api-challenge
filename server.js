const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// configure mongoose to use ES6 promises
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const blogPostRouter = require('./blogPostRouter');

const app = express();
app.use(morgan('common'));
app.use('/posts', blogPostRouter);

// catch-all
app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
})

// server object for runServer and closeServer functions
let server;

// starts server and returns a promise.
function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(server);
        }).on('error', err => {
            reject(err)
        });
    });
}

// closes server and returns a promise
function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

// handle case where server.js is called directly
if (require.main === module) {
    runServer().catch(err => console.error(err));
};

// export commands
module.exports = { app, runServer, closeServer };