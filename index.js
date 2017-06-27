const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());

app.start = (options) => {
    const connect = require('reactive-mongodb').connect;
    connect(options.databaseUrl).then(() => {

    }, (err) => {
        console.log(err);
    });

    if (options && options.cors === true) {
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            // intercept OPTIONS method
            if ('OPTIONS' == req.method) {
                res.send(200);
            } else {
                next();
            }
        });
    }
    app.set('port',options.port)
    app.listen(app.get('port'));
    console.log('App is running on port ' + app.get('port'));
    console.log('Thank you for Using Cardigan By Red Carpet Solutions');
}

app.authModel = (model, options) => {
    app.use(model.route, model.router);
    var authRouter = require('./modules/auth.module.js');
    authRouter.setModel(model);
    authRouter.setOptions(options);
    app.use('/auth', authRouter);
}

app.addCollection = (model) => {
    app.use(model.route, model.router);
}



module.exports.app = app;
module.exports.static = express.static;
module.exports.Model = require('./modules/model.module.js');