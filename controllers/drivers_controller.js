const Driver = require('../models/driver');

module.exports = {
    greeting(req, res) {
        res.send({hi: 'there'});
    },

    index(req, res, next) {

        const { lng, lat } = req.query;

        Driver.find({
            'geometry.coordinates': {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 200000
                }
            }
        })
        /* Legacy way (< version 5.0.0 mongo)
        Driver.find(
            {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            {
                spherical: true,
                maxDistance: 200000
            }
        )*/
            .then((drivers) => {
                return res.send(drivers);
            })
            .catch(next);
    },

    create(req, res, next) {
        const driverProps = req.body;
        Driver.create(driverProps)
            .then((driver) => {
                return res.status(201).send(driver);
            })
            .catch(next)
    },

    edit(req, res, next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate({_id: driverId}, driverProps)
            .then(() => Driver.findById(driverId))
            .then(driver => res.send(driver))
            .catch(next);
    },

    delete(req, res, next) {
        const driverId = req.params.id;

        Driver.findByIdAndRemove({_id: driverId})
            .then(driver => res.status(204).send(driver))
            .catch(next);
    }
};