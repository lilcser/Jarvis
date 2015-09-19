module.exports = function() {
	/** 
	 * Allow CORS
	 */
	App.app.all('*', function(req, res, next) {
	    if (!req.get('Origin')) return next();

	    res.set('Access-Control-Allow-Origin', '*');
	    res.set('Access-Control-Allow-Methods', 'GET, POST');
	    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

	    if ('OPTIONS' == req.method) return res.sendStatus(200);

	    next();
	});

	// Main route handlers
	App.app.use('/', App.route('index'));
	App.app.use('/api', App.route('api'));

	/** 
	 * Catch 404 and forward to error handler
	 */
	App.app.use(function(req, res, next) {
		var err = new Error('Not found');
		err.status = 404;
		next(err);
	});
}