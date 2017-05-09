const express = require('express');
var app = express();

const connect = require('reactive-mongodb').connect;
connect('mongodb://127.0.0.1:27017/test').then(() => {
    var Model = require('./modules/model.module.js');
    var x = new Model('test');
    app.use(x.route, x.router);
});






app.listen(9999);
console.log('App is running on port 9999');