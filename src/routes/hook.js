const axios = require('axios');
const { Router } = require('express');
const Route = require('../Base/Route');
const MessageEmbed = require('../utils/MessageEmbed');

class Hook extends Route {
  constructor(parent) {
    super({
      route: '/webhook'
    });

    Object.assign(this, parent);

    const Webhook = this.utils.WebhookClient;

    this.webhook = new Webhook(this.config.webhook.id, this.config.webhook.token);

    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/:path', (req, res) => {
      const path = this.config.lists.find((list) => list.path === `/${req.params.path}`);
      if (!path) return res.status(404).json({ error: true, status: 404, message: 'Invalid Path.' });
      if (req.get('Authorization') !== path.token) return res.status(401).json({ error: true, status: 401, message: 'Authorization Header missing or invalid token.' });

      axios({
        method:'get',
        url:`https://discordapp.com/api/users/${(typeof req.body.user === 'string' ? req.body.user : req.body.user.id)}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bot BOT_TOKEN'
        },
        responseType:'JSON'
      }).then((discordUser) => {
        const format = discordUser.data.avatar && discordUser.data.avatar.startsWith('a_') ? 'gif' : 'png';

        const Message = new MessageEmbed()
          .setDescription(`[**Upvote**](https://${this.config.lists.find(((list) => list.path === `/${req.params.path}`)).upvoteURL ? this.config.lists.find(((list) => list.path === `/${req.params.path}`)).upvoteURL : null})\n**  **\n:incoming_envelope: \`${discordUser.data.username}#${discordUser.data.discriminator}\` just upvoted \`BOT_NAME\`.`)
          .setColor(0xffffff)
          .setThumbnail(`https://cdn.discordapp.com/avatars/${(typeof req.body.user === 'string' ? req.body.user : req.body.user.id)}/${discordUser.data.avatar}.${format}?size=512`)
          .setFooter(this.config.lists.find(((list) => list.path === `/${req.params.path}`)).name, `https://cdn.discordapp.com/avatars/${(typeof req.body.user === 'string' ? req.body.user : req.body.user.id)}/${discordUser.data.avatar}.${format}?size=512`)
          .setTimestamp();

        this.webhook.send(null, this.config.webhook.name, this.config.webhook.avatar, Message.embed);
        return res.status(200).json({ error: false, status: 200, message: 'OK!' });
      });
    });
  }

  getSite() {
    return async (req, res, next) => {
      const site = this.config.lists.find((list) => list.path === `/${req.params.path}`);

      if (!site) return res.status(404).json({ error: true, statusCode: 404, message: 'An invalid was PATH.' });

      res.locals.site = site;
      next();
    };
  }

  checkAuthorization() {
    return (req, res, next) => {
      if (!req.get('Authorization')) return res.status(401).json({ error: true, statusCode: 401, message: 'Missing Authorization header' });
      if (req.get('Authorization') !== res.locals.site.token) return res.status(401).json({ error: true, statusCode: 401, message: 'An invalid Authorization token was provided.' });

      next();
    };
  }
}

module.exports = Hook;