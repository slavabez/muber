const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers controller tests', () => {
    it('handles a POST request to the /api/drivers, should create a new driver', (done) => {
        // Count drivers
        Driver.count().then((count) => {
            request(app)
                .post('/api/drivers')
                .send({ email: 'test@test.com' })
                .end(() => {
                    // Count again, make sure there's one more than there were
                    Driver.count()
                        .then((newCount) => {
                            assert(count + 1 === newCount);
                            done();
                        });
                });
        });
    });

    it('handles a PUT request to /api/drivers/:id to update an existing driver and return it', (done) => {
        const newDriver = new Driver({
            email: 't@t.com',
            driving: false
        });

        newDriver.save()
            .then(() => {
                request(app)
                    .put(`/api/drivers/${newDriver._id}`)
                    .send({driving: true})
                    .end(() => {
                        Driver.findOne({email: 't@t.com'})
                            .then(driver => {
                                assert(driver.driving);
                                done();
                            })
                    })
            })
    });

    it('handles a DELETE request to /api/drivers/:id and deletes the driver', (done) => {
        const driver = new Driver({email: 'test@test.com'});
        driver.save()
            .then(() => {
                request(app)
                    .delete(`/api/drivers/${driver._id}`)
                    .end(() => {
                        Driver.findOne({email: 'test@test.com'})
                            .then(driver => {
                                assert(driver === null);
                                done();
                            })
                    })
            })
    });

    it('handles the index query on /api/drivers and returns drivers that are close', (done) => {
        const seattleDriver = new Driver({
            email: 'seattle@gmail.com',
            geometry: {
                type: 'Point',
                coordinates: [ -122.4759902, 47.6147628 ]
            }
        });

        const miamiDriver = new Driver({
            email: 'miami@gmail.com',
            geometry: {
                type: 'Point',
                coordinates: [ -80.253, 25.791 ]
            }
        });

        Promise.all([seattleDriver.save(), miamiDriver.save()])
            .then(() => {
                request(app)
                    .get('/api/drivers?lng=-80&lat=25')
                    .end((err, response) => {
                        assert(response.body.length === 1);
                        assert(response.body[0].email === 'miami@gmail.com');
                        done();
                    })
            })
    });
});