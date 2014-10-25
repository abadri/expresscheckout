// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var PaypalExpress = require('./lib/paypal-express');
var config = require('./lib/config');

var paypal = new PaypalExpress(config.username, config.password, config.signature);
paypal.useSandbox(true);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// more routes for our API will happen here

router.route('/setEC')

	// create a setEC (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
		paypal.beginInstantPayment(req.body, function(err, data) {
			if (err) {
				res.json({ message: err});
			}
			if (data) {
				var token = data.token;
				var payment_url = data.payment_url;
				res.json({'token':token});
			}
		});
		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		paypal.beginInstantPayment({
			'RETURNURL': 'http://yahoo.com',
			'CANCELURL': 'http://google.com',
			'PAYMENTREQUEST_0_AMT': 1, //Payment amount
			//More request parameters
		}, function(err, data) {
			if (err) {
				console.error(err);
			}

			if (data) {
				var token = data.token;
				var payment_url = data.payment_url;
				res.json({'token':token});
			}
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);