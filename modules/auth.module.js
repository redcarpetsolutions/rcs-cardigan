const router = require('express').Router();
const validate = require('hyvalidator').validate;
const Strings = require('hyvalidator').Strings;
const rcsres = require('rcs-jsonstyle');
const jwt = require('jsonwebtoken');
const config = require('./config.module.js');
const bcrypt = require('bcryptjs');
const Collection = require('reactive-mongodb').Collection;

var User;
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
                if (!user.role) {
                    user.role = "user";
                }
                User.collection.insert(user).subscribe(null, (err) => {
                    console.log(err);
                    rcsres.error(res);
                }, () => {
                    rcsres.created(res);
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

router.setModel = (user) => {
    User = user;
}
module.exports = router;