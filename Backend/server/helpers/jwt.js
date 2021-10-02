const expressJwt = require('express-jwt'); // lib secures server's API checking if user's token is generated with a "right" secret

function authJwt() {
	const secret = process.env.SECRET;
	return expressJwt({ // decode a token with a secret and algorithms specified to authorize a user
		secret,
		algorithms: ['HS256'], // algorithm used to generated a token
		isRevoked: isRevoked // isRevoked field allows to revoke a token under specific condition. Those specific condition we spacify in a callback function called isRevoked
	}).unless({ // exclude API below from jwt authentication required. API below can be accessed with no token required
		path: [
			'/users/login', // just paths
			'/users/register',
			{ url: /\/cars(.*)/, methods: ['GET', 'OPTIONS'] }, // a regular expression to specify cars/.. API accessible with GET method with no token required]
			{ url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] } // make uploads accessible with no token required
		]
	})
}

// params (request to have an access to request body, payload contains data from a token, done if rejected or not)
async function isRevoked(req, payload, done) {
	if (!payload.isAdmin) {
		done(null, true); // null = reject token
	}
	done();
}

module.exports = authJwt;