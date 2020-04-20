const { Router } = require('express');

class Route {
	constructor(options) {
		this.path = options.path;
		this.router = Router();
	}
}

module.exports = Route;
