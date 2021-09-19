const expressJwt = require('express-jwt'); // lib secures server's API checking if user's token is generated with a "right" secret

function authJwt() {
	const secret = process.env.SECRET;
	return expressJwt({ // decode token with secret and algorithms specified to authorize user
		secret,
		algorithms: ['HS256'], // algorithm used to generated token
		isRevoked: isRevoked // isRevoked field allows to revoke token under specific condition. Those specific condition we spacify in callback function called isRevoked
	}).unless({ // exclude API below from jwt authentication required. API below can be accessed without token
		path: [
			'/users/login', // just paths
			'/users/register',
			{ url: /\/cars(.*)/, methods: ['GET', 'OPTIONS'] } // regular expression to specify cars/.. API accessible with GET method without token required]
		]
	})
}

// params (request to have access to request body, payload contains data from token, done if rejected or not)
async function isRevoked(req, payload, done) {
	if (!payload.isAdmin) {
		done(null, true); // null = reject token
	}
	done();
}

module.exports = authJwt;