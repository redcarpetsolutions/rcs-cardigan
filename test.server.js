const app = require('./index.js').app;
const Model = require('./index.js').Model;


const User = new Model('users');
app.authModel(User);
const Call = new Model('calls');
app.addCollection(Call);



var options = {
    port: 3000,
    databaseUrl: 'mongodb://127.0.0.1:27017/test'
}
app.start(options);