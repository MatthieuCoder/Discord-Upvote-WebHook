const chalk = require('chalk');
const dateFormat = require('dateformat');
const util = require('util');

/**
 * Provides some logs for info, errors and warns
 * @typedef {Logger} Logger
 */
class Logger {
	/**
   * Used to have the date on the log more simply
   * @function date()
   */
	static get date() {
		return chalk.gray(dateFormat(Date.now(), 'ddd HH:MM:ss'));
	}

	/**
   * Used to format arguments.
   * @function formatInput()
   * @param {Object} args - Message(s) to be shown in the log.
   * @returns {Object}
   */
	static formatInput(args) {
		return args.map((arg) => arg instanceof Object ? util.inspect(arg) : arg);
	}

	/**
   * Used to display some messages.
   * @function logger.log()
   * @param {Object} args - Message(s) to be shown in the log.
   * @returns {void}
   */
	static log(...args) {
		args = this.formatInput(args);
		console.log(`${chalk.red('[INFO]')} - [${this.date}] - - ${args.join(' ')}`);
	}

	/**
   * Used to display warnings messages.
   * @function logger.warn()
   * @param {Object} args - Message(s) to be shown in the log.
   * @returns {void}
   */
	static warn(...args) {
		args = this.formatInput(args);
		console.warn(`${chalk.red('[WARN]')} - [${this.date}] - - ${args.join(' ')}`);
	}

	/**
   * Used to display errors messages.
   * @function logger.error()
   * @param {Object} args - Message(s) to be shown in the log.
   * @returns {void}
   */
	static error(...args) {
		args = this.formatInput(args);
		console.error(`${chalk.red('[ERROR]')} - [${this.date}] - - ${args.join(' ')}`);
	}
}

module.exports = Logger;
