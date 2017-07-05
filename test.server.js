const app = require('./index.js').app;
const Model = require('./index.js').Model;

var options = {
    port: 3000,
    databaseUrl: 'mongodb://127.0.0.1:27017/test'
}
app.start(options);

const User = new Model('users');
let emailContent=`
<h1>Validation Email</h1>
<p>Me would love to kiss you:</p>
`;
app.authModel(User,{
    emailValidation:true,
    emailContent
});
const Call = new Model('calls');
app.addCollection(Call);

app.setProvider('Toutou is here');