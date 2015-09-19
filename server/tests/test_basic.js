var env     = process.env.NODE_ENV || 'test',
    config  = require('../config/config.js')[env],
    should  = require('should'),
    http    = require('http'),
    agent   = require('superagent');

const URL = config.server_url + ':' + config.port;

describe('basic requests', function () {
    it('index response', function (done) {
        agent
            .get(URL)
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.message.should.equal('For API, please, use /api/paints and /api/stores');

                    done();          
                }        
            });
    });

    it('wrong path response', function (done) {
        agent
            .get(URL + '/asd')
            .end(function(err, res) {
                res.statusCode.should.equal(404);
                res.should.be.json;      

                res.body.success.should.equal(false);
                res.body.message.should.equal('Not found');

                done();                  
            });    
    });
});