var env             = process.env.NODE_ENV || 'development',
    config          = require('./config.js')[env],
    packageJson     = require('../package.json'),
    path            = require('path'),
    express         = require('express'),
    cookieParser    = require('cookie-parser'),
  	bodyParser      = require('body-parser');

/**
 * Global application object
 */
global.App = {
  	app: express(),
    server: null,
	port: process.env.PORT || config.port || 3000,
	IP: process.env.IP || config.IP || '0.0.0.0',
	version: packageJson.version,
	root: path.join(__dirname, '..'),
    env: env,
    config: config,
	db: null,
	appPath: function (path) {
		return this.root + '/' + path;
	},
	require: function (path) {
		return require(this.appPath(path));
	},	
	start: function () {
		if (!this.started) {
			console.log('Loading App in ' + env + ' mode.');
			this.started = true;
			this.server = this.app.listen(this.port, this.IP, function () {
				console.log('Running App Version ' + App.version + ' at ' + App.IP + ' on port ' + App.port + ' in ' + App.env + ' mode.');
			});
			this.app.on('error', onError);
		}
	},
	stop: function () {        
        if (this.server) this.server.close();
	},
	route: function (path) {
		return this.require('./routes/' + path);
	},
	middleware: function (path) {
		return this.require('./middlewares/' + path);
	}
};


// Middlewares
App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({ extended: false }));
App.app.use(cookieParser());
App.app.use(express.static(App.appPath('public')));


// Routing
App.require('config/routes')();


// Database connection
App.require('./config/database.js')(process.env.DATABASE_URL || config.db_url || 'mongodb://localhost/fifty-shades_development');


// error handlers

/**
 * Development error handler.
 * Will print stacktrace.
 */
if (App.app.get('env') === 'development') {
  	App.app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.json({
	    	success: false,
	    	message: err.message,
	    	error: err
	    });
	});
}

/**
 * Production error handler.
 * No stacktraces leaked to user.
 */
App.app.use(function(err, req, res, next) {
  	res.status(err.status || 500);
  	res.json({
    	success: false,
    	message: err.message,
    	error: {}
  	});
});


// Helper functions

/**
 * Normalize a port into a number, string, or false.
 */ 
function normalizePort(val) {
 	var port = parseInt(val, 10);

  	if (isNaN(port)) {
    	// named pipe
    	return val;
  	}

  	if (port >= 0) {
    	// port number
    	return port;
  	}

  	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  	if (error.syscall !== 'listen') {
    	throw error;
  	}

  	var bind = typeof port === 'string'
    	? 'Pipe ' + port
    	: 'Port ' + port;

  	// handle specific listen errors with friendly messages
  	switch (error.code) {
    	case 'EACCES':
	      	console.error(bind + ' requires elevated privileges');
	      	process.exit(1);
	      	break;
    	case 'EADDRINUSE':
		      console.error(bind + ' is already in use');
		      process.exit(1);
		      break;
	    default:
	      	throw error;
  	}
}