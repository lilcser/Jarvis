before('run test server', function (done) {
	require('../bin/run_test_server');

	this.timeout(4000);
	setTimeout(done, 1500);
});

after('stop test server', function () {
	App.stop();
});