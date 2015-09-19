var MongoClient = require('mongodb').MongoClient;

/**
 * Esteblish database connection.
 */
function connect(connectionString) {
	MongoClient.connect(connectionString, function(err, db) {
	  	if (err) console.log('Database connection error\n');
	  	else console.log('Connected correctly to database\n');

		// Make db connection available to the whole application	  
	  	App.db = db;
	});
};

module.exports = connect;