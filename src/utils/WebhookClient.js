'use strict';

const axios = require('axios');
const Snowflake = require('../utils/Snowflake');
const baseURL = 'https://discordapp.com/api/webhooks';

/**
 * Represents the Webhook Client
 * @typedef {WebhookClient} WebhookClient
 */
class WebhookClient {
  /**
   * @constructor
   * @param {Snowflake} id ID of the webhook
   * @param {string} token token of the webhook
   */
  constructor(id, token) {
    if (!id) throw new Error('No id found!');

    /**
     * The ID of the webhook
     * @type {Snowflake}
     */
    this.id = id;

    if (!token) throw new Error('No token found!');

    /**
     * The token for the webhook
     * @type {?string}
     */
    Object.defineProperty(this, 'token', { value: token || null, writable: true, configurable: true });
  }

  /**
   * Sends a message with this webhook.
   * @param {?string} message The message
   * @param {?string} name The name of the webhook
   * @param {?string} avatar The avatar for the webhook
   * @param {Array} embed The embed
   * @returns {void}
   */
  async send(message = null, name = null, avatar = null, embed = []) {
    if (!message && embed.length === 0) throw new Error('You cannot send an empty message.');

    await axios({
      method: 'post',
      url: `${baseURL}/${this.id}/${this.token}`,
      data: {
        username: name,
        avatar_url: avatar,
        content: message,
        embeds: embed
      }
    })
      .then()
      .catch((err) => {
        if (err) throw new Error(`Error:\n${err}`);
      });
  }
}

module.exports = WebhookClient;