var env     = process.env.NODE_ENV || 'test',
    config  = require('../config/config.js')[env],
    should  = require('should'),
    http    = require('http'),
    agent   = require('superagent');

const API_URL = config.server_url + ':' + config.port + '/api/stores';

describe('stores api', function () {
    it('empty request', function (done) {
        agent
            .post(API_URL)
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Please, pass location data');

                    done();          
                }        
            });
    });

    it('request not to get any store', function (done) {
        agent
            .post(API_URL)
            .send({location_data: {latitude: 0, longitude: 0}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(false);
                    res.body.message.should.equal('No Canadian Tire stores nearby');

                    done();          
                }        
            });
    });

    it('request to get store', function (done) {
        agent
            .post(API_URL)
            .send({location_data: {latitude: 43.464258, longitude: -80.52041}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      
                    
                    res.body.success.should.equal(true);
                    res.body.store.address_html.should.equal('656 Erb Street West, <span class="locality">Waterloo</span>, <span class="region">ON</span> <span class="postal-code">N2T 2Z7</span>, <span class="country-name">Canada</span>');
                    res.body.store.address_formatted.should.equal('656 Erb Street West, Waterloo, ON N2T 2Z7, Canada');
                    res.body.store.phone_number.should.equal('(519) 884-1255');
                    res.body.store.hours_of_operation.should.be.json;
                    res.body.store.location_coordinates.should.be.json;
                    res.body.store.location_coordinates.latitude.should.equal(43.447781);
                    res.body.store.location_coordinates.longitude.should.equal(-80.573845);

                    done();          
                }        
            });
    });
});