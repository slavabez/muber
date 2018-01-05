const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/muber_test');
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', err);
        })
});

beforeEach(done => {
    const {drivers} = mongoose.connection.collections;
    drivers.drop()
        // Dropped drivers
        .then(() => done())
        // Error dropping, but should be fine since nothing was in there
        .catch(() => done());
});