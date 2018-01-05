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
});