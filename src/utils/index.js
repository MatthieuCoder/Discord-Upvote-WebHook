/**
 * @typedef Utils
 * @property {import("./MessageEmbed").MessageEmbed} MessageEmbed
 * @property {import("./logger.js").Logger} logger
 * @property {import("./Snowflake.js").Snowflake} Snowflake
 * @property {import("./WebhookClient.js").WebhookClient} WebhookClient
 */

module.exports = {
	MessageEmbed: require('./MessageEmbed'),
	logger: require('./logger'),
	Snowflake: require('./Snowflake'),
	WebhookClient: require('./WebhookClient')
};
