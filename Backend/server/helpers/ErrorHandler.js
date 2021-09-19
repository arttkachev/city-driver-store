function errorHandler(err, req, res, next) {

	if (err) {
		// jwt authentication error
		if (err.name === 'UnauthorizedError') {
			return res.status(401).json({ message: 'The user is not authorized' });
		}
		// validation error
		if (err.name === 'ValidationError') {
			return res.status(401).json({ message: err });
		}
		// common error
		return res.status(500).json(err);
	}
}

module.exports = errorHandler;