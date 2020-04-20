const { Router } = require('./node_modules/express');

class Route {
	constructor(options) {
		this.path = options.path;
		this.router = Router();
	}
}

module.exports = Route;
