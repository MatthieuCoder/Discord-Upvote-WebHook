require('dotenv').config();

/**
 * @typedef {Object} WebhookServer
 * @prop {Object} routers
 * @prop {import("./utils").Utils} utils Some util methods and classes
 * @prop {import("./config")} config The config file
 */

const express = require('express');
const helmet = require('helmet');
const { readdir } = require('fs').promises;
const { join } = require('path');

const { STATUS_CODES } = require('http');

/**
 * @description Represents an http server instance
 * @class WebhookServer
 */
class WebhookServer {
	constructor() {
		/** @type {Object} */
		this.routers = [];

		this.app = express();
		/** @type {import("./config")} */
		this.config = require('./config');
		/** @type {import("./utils/index.js").Utils} */
		this.utils = require('./utils');

		this._serverSetup();
	}

	/**
	 * @description A method to setup the server
	 * @private
	 * @returns {void}
	 */
	_serverSetup() {
		this.app.set('trust proxy', 1);
		this.app.use(helmet());

		this.app.use((req, res, next) => {
			res.header('X-Provider', 'UniX Technology Corporation');

			res.set('Access-Control-Allow-Origin', '*');
			res.set('Access-Control-Allow-Methods', 'GET, POST');

			this.utils.logger.log(`${(req.ip || req.headers['x-forwarded-for'] || (req.connection && req.connection.remoteAddress) || undefined)} - ${req.originalUrl || req.url} "${req.method} / HTTP/:${req.httpVersionMajor + '.' + req.httpVersionMinor}" - ${res.statusCode ? res.statusCode : undefined }`);

			next();
		});

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));

		this._loadRoutes(join(__dirname, 'routes'));

		this._listen();
	}

	/**
	 * @description A method to all load routes
	 * @param directory A PATH to routes folder
	 * @private
	 * @returns {Promise<void>}
	 */
	async _loadRoutes(directory) {
		const routes = await readdir(directory);

		if (routes.length > 0) {
			for (let i = 0; i < routes.length; i++) {
				const Router = require(join(directory, routes[i]));
				const route = new Router(this);
				this.routers.push(route);

				if (i + 1 === routes.length) {
					for (i = 0; i < this.routers.length; i++) {
						this.app.use(this.routers[i].path, this.routers[i].router);

						if (i + 1 === this.routers.length) {
							this.app.use(async (req, res) => {
								res.status(404).json({
									error: { status: 404, message: STATUS_CODES[404], stack: null }
								});
							});

							this.app.use(async (err, req, res, next) => {
								this.utils.logger.error(err.stack || err);

								res.status(err.status || 500).json({
									error: { status: err.status || 500, message: STATUS_CODES[err.status || 500], stack: err.stack }
								});
							});
						}
					}
				}
			}
		}
	}

	/**
	 * @description A method to listen the app on a specific port
	 * @private
	 * @returns {void}
	 */
	_listen() {
		this.app.listen(process.env.PORT || 3000, (err) => {
			if (err) return this.utils.logger.error(err);
			this.utils.logger.log(`Running on port :::${process.env.PORT || 3000}`);
		});
	}
}

module.exports = WebhookServer;
