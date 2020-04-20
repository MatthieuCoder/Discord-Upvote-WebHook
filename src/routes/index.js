const Route = require('../Base/Route');

class Index extends Route {
	constructor(parent) {
		super({
			path: '/'
		});

		Object.assign(this, parent);

		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', (req, res) => {
			return res.status(200).send({ error: false, status: 200, message: 'Ok!' });
		});
	}
}

module.exports = Index;
