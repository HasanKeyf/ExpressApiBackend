var request = require('supertest')
process.env.NODE_ENV = 'test'
var server = require('../index.js');


describe('GET /api/tweets/', function(){
    it('respond with 404', function(done){
        request(server)
            .get('/api/tweets/55231d90f4d19b49441c9cb9')
            //.set('Accept', 'application/json')
            //.expect('Content-Type', /json/)
            .expect(404, done);
    })
})


///api/tweets/55231d90f4d19b49441c9cb9