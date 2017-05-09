const rcsres = require('rcs-jsonstyle');
const Collection = require('reactive-mongodb').Collection;

class Model {
    constructor(name) {
        this.router = require('express').Router();
        this.route = '/' + name;
        this.collection = new Collection(name);

        this.router.get('/', (req, res) => {
            var data = new Array();
            this.collection.find().subscribe((item) => {
                data.push(item);
            }, () => {

            }, () => {
                rcsres.json(res, data);
            });
        });

        this.router.get('/query/:query', (req, res) => {
            try {
                var data = new Array();
                this.collection.find(JSON.parse(req.params.query)).subscribe((item) => {
                    data.push(item);
                }, () => {

                }, () => {
                    rcsres.json(res, data);
                });
            } catch (e) {
                rcsres.badRequest(res, "The query provided is not a valid JSON Object");
            }

        });

        this.router.get('/:id', (req, res) => {
            if (req.params.id.length === 24) {
                this.collection.findById(req.params.id).subscribe((item) => {
                    rcsres.json(res, item);
                }, () => {
                }, () => {
                });
            } else {
                rcsres.badRequest(res, "The id provided is not a valid ObjectID");
            }
        });

    }
}

module.exports = Model;