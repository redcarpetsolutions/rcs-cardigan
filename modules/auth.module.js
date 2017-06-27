const router = require('express').Router();
const validate = require('hyvalidator').validate;
const Strings = require('hyvalidator').Strings;
const rcsres = require('rcs-jsonstyle');
const jwt = require('jsonwebtoken');
const config = require('./config.module.js');
const bcrypt = require('bcryptjs');
const Collection = require('reactive-mongodb').Collection;
const mailer = require('./email.module.js');

var User;
let emailContent=`
<h1>Validation Email</h1>
<p>Your Account validation link is:</p>
`;
let options = {
    emailValidation: false,
    emailContent
}
router.post('/login', (req, res) => {
    var rules = new Strings.Rule;
    rules.setIsEmail();
    var errors = validate(req.body.email, rules);
    if (errors) {
        rcsres.badRequest(res, "Please Enter a valid Email Adress");
    }
    else {
        User.collection.findOne({ email: req.body.email }).subscribe((data) => {
            if (data !== null) {
                if (!options.emailValidation || (options.emailValidation && data.valid)) {
                    if (bcrypt.compareSync(req.body.password, data.password)) {
                        var payload = {
                            email: data.email,
                            password: data.password,
                            role: data.role
                        }
                        var token = jwt.sign(payload, config.jwtsecret);
                        rcsres.json(res, { user: data, token: token });
                    } else {
                        rcsres.unauthorized(res, "Wrong Password");
                    }
                } else {
                    rcsres.unauthorized(res, "This Account has not been activated");
                }
            } else {
                rcsres.badRequest(res, "This User Doesn't Exist");
            }
        }, (err) => {
            console.log(err);
            rcsres.error(res);
        });
    }
});

router.post('/register', (req, res) => {
    var rules = new Strings.Rule;
    rules.setIsEmail();
    var errors = validate(req.body.email, rules);

    if (errors) {
        rcsres.badRequest(res, "Please Enter a valid Email Adress");
    } else {
        User.collection.findOne({ email: req.body.email }).subscribe((data) => {
            if (data !== null) {
                rcsres.badRequest(res, "This Email Is Already Taken");
            } else {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                var user = req.body;
                user.password = hash;
                if (!user.valid) {
                    if (options.emailValidation) {
                        user.valid = false;
                    } else {
                        user.valid = true;
                    }
                    if (!user.role) {
                        user.role = "user";
                    }
                }
                User.collection.insert(user).subscribe(null, (err) => {
                    console.log(err);
                    rcsres.error(res);
                }, () => {
                    let url = req.protocol +"://"+req.get('host');
                    let payload = {
                        email: user.email
                    }
                    let token = jwt.sign(payload, config.jwtsecret);
                    url += "/auth/validation/" + token;
                    mailer.sendEmail(user.email, "ghalia.ouderni@esprit.tn", "Validation Email", options.emailContent+"<a href=\"" + url + "\">" + url + "</a>");
                    rcsres.created(res, "Confirmation Email Sent");
                });
            }
        }, (err) => {
            console.log(err);
            rcsres.error(res);
        });
    }
});

router.get('/info', (req, res) => {
    let header = req.headers.authorization;
    let arr = header.split(' ');
    if (arr[0] !== 'bearer') {
        res.send({});
    }
    let token = arr[1];

    let decoded = jwt.decode(token);


    let Users = new Collection('users');
    Users.findOne({ "email": decoded.email }).subscribe(data => {
        rcsres.json(res, data);
    }, (err) => {
        console.log(err);
        rcsres.error(res, err);
    });
});

router.get('/validation/:token', (req, res) => {
    let token = req.params.token;

    let decoded = jwt.decode(token);

    let Users = new Collection('users');
    Users.findOne({ "email": decoded.email }).subscribe(data => {
        data.valid = true;
        Users.updateById(data._id.toString(), data).subscribe(null, err => console.log(err),
            () => {
                let response = { message: "Your Account has been activated", user: data };
                rcsres.json(res, response);
            });
    }, (err) => {
        console.log(err);
        rcsres.error(res, err);
    });
});

router.setModel = (user) => {
    User = user;
}
router.setOptions = (newOptions) => {
    options = newOptions;
}
module.exports = router;