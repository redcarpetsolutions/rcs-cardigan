const express = require('express');
const bodyParser = require('body-parser');
const rcsres = require('rcs-jsonstyle');

var chalk = require('chalk');

var app = express();

app.use(bodyParser());


app.get('/rcs/routing', (req, res) => {
    res.redirect('/rcs/routing/index.html');
});

app.get('/rcs/routing/*', (req, res) => {
    var path = req.params[0];
    if (path.indexOf('..') === -1) {
        res.sendfile(__dirname + '/views/' + path);
    } else {
        res.status = 404;
        res.send('Not Found');
    }
});

app.get('/rcs/internal/apis',(req,res)=>{
    res.send('Cheers Love, This is still under construction my bad');
});

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
    app.set('port', options.port);
    app.listen(app.get('port'));
    setTimeout(() => {
        console.log();
        console.log(chalk.green('App is running on port ' + app.get('port')));
        console.log(chalk.bold('Thank you for Using Cardigan By Red Carpet Solutions V0.8.6'));
        console.log(chalk.red('All the endpoint generated by the framework are displayed in the logs'));
        console.log();
    }, 1000);


}

app.authModel = (model, options) => {
    app.use(model.route, model.router);
    var authRouter = require('./modules/auth.module.js');
    authRouter.setModel(model);
    authRouter.setOptions(options);
    app.use('/auth', authRouter);
    ////Log Messages
    console.log(chalk.green("////////////////////////////////////////////////////"));
    console.log(chalk.blue("Authentication:"));
    console.log(chalk.green("////////////////////////////////////////////////////"));
    console.log();
    console.log(chalk.yellow("Registration:"));
    console.log();
    console.log({
        method: "POST",
        payload: "User Model",
        url: "/auth/register"
    });
    console.log();
    console.log(chalk.yellow("Login:"));
    console.log();
    console.log({
        method: "POST",
        payload: "User Model",
        url: "/auth/login"
    });
    console.log();
    console.log(chalk.yellow("Current User:"));
    console.log();
    console.log({
        method: "POST",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        payload: "User Model",
        url: "/auth/register"
    });
    console.log();
}

app.addCollection = (model) => {
    app.use(model.route, model.router);
    console.log(chalk.green("////////////////////////////////////////////////////"));
    console.log(chalk.blue("Collection : " + model.name));
    console.log(chalk.green("////////////////////////////////////////////////////"));
    console.log();
    console.log(chalk.yellow("Get all " + model.name));
    console.log({
        method: "GET",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        url: model.route
    });
    console.log();
    console.log(chalk.yellow("Query " + model.name + " in JSON format"));
    console.log({
        method: "GET",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        url: model.route + "/query/:query",
        params: {
            query: model.name + " Model"
        }
    });
    console.log();
    console.log(chalk.yellow("Get " + model.name + "by _id"));
    console.log({
        method: "GET",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        url: model.route + "/:id",
        params: {
            query: model.name + " _id"
        }
    });
    console.log();
    console.log(chalk.yellow("Insert " + model.name));
    console.log({
        method: "POST",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        url: model.route,
        payload: "Calls Model"
    });

    console.log();
    console.log(chalk.yellow("Update " + model.name));
    console.log({
        method: "PUT",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        url: model.route + "/:id",
        params: {
            query: model.name + " _id"
        },
        payload: "Calls Model"
    });

    console.log();
    console.log(chalk.yellow("Delete " + model.name));
    console.log({
        method: "DELETE",
        header: {
            "Authorization": "bearer + \"Token\""
        },
        url: model.route + "/:id",
        params: {
            query: model.name + " _id"
        }
    });
}
app.setProvider = rcsres.setProvider;


module.exports.app = app;
module.exports.static = express.static;
module.exports.Model = require('./modules/model.module.js');