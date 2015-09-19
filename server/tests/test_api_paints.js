var env     = process.env.NODE_ENV || 'test',
    config  = require('../config/config.js')[env],
	should  = require('should'),
    http    = require('http'),
    agent   = require('superagent');

const API_URL = config.server_url + ':' + config.port + '/api/paints';

describe('paints api', function () {
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
                    res.body.message.should.equal('Please, pass config');

                    done();          
                }        
            });
    });

    it('request to get all paints', function (done) {
        agent
            .post(API_URL)
            .send({config: {}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.paints.should.have.length(120);
                    res.body.finishes.should.have.length(9);

                    done();          
                }        
            });
    });

    it('get paints by color preference', function (done) {
        agent
            .post(API_URL)
            .send({config: {color_preference: 'blue'}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.paints.should.have.length(36);
                    
                    for (var i = 0; i < res.body.paints.length; i++) {
                    	res.body.paints[i].type.should.be.oneOf('blue', 'orange', 'red');
                    }

                    done();          
                }        
            });
    });

    it('get paints by room colors', function (done) {
        agent
            .post(API_URL)
            .send({config: {room_colors: 'dark'}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.paints.should.have.length(80);
                    
                    for (var i = 0; i < res.body.paints.length; i++) {
                    	res.body.paints[i].light.should.be.oneOf('medium-dark', 'medium-light', 'light', 'intense-light');
                    }

                    done();          
                }        
            });
    });

    it('get paints by room type', function (done) {
        agent
            .post(API_URL)
            .send({config: {room_type: 'bedroom'}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.paints.should.have.length(60);
                    
                    for (var i = 0; i < res.body.paints.length; i++) {
                    	res.body.paints[i].intensity.should.be.equal('cool');
                    }

                    done();          
                }        
            });
    });

    it('get paints by room feel', function (done) {
        agent
            .post(API_URL)
            .send({config: {room_feel: 'cluttered'}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.paints.should.have.length(80);
                    
                    for (var i = 0; i < res.body.paints.length; i++) {
                    	res.body.paints[i].light.should.be.oneOf('medium-dark', 'medium-light', 'light', 'intense-light');
                    }

                    done();          
                }        
            });
    });

    it('get finishes by people number', function (done) {
        agent
            .post(API_URL)
            .send({config: {people_number: 'low'}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.finishes.should.have.length(3);
                    
                    for (var i = 0; i < res.body.finishes.length; i++) {
                    	res.body.finishes[i].type.should.be.equal('flat/matte');
                    }

                    done();          
                }        
            });
    });

    it('get paints and finishes by simple test case', function (done) {
        agent
            .post(API_URL)
            .send({config: {
            		color_preference: 'yellow', 
            		room_colors: 'light', 
            		room_type: 'kitchen', 
            		room_feel: 'regular', 
            		people_number: 'high'
            	}})
            .end(function(err, res) {
                if (err) {
                    done(new Error(err));
                }
                else {
                    res.statusCode.should.equal(200);
                    res.should.be.json;      

                    res.body.success.should.equal(true);
                    res.body.paints.should.have.length(6);
                    
                    for (var i = 0; i < res.body.paints.length; i++) {
                    	res.body.paints[i].type.should.be.oneOf('yellow', 'purple', 'red');
                    	res.body.paints[i].light.should.be.oneOf('medium-dark', 'medium-light');
                    	res.body.paints[i].intensity.should.be.equal('warm');
                    }

                    for (var i = 0; i < res.body.finishes.length; i++) {
                    	res.body.finishes[i].type.should.be.equal('eggshell');
                    }

                    done();          
                }        
            });
    });
});