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
    this.router.post('/:path', this.getSite(), this.checkAuthorization(), (req, res) => {
      const site = res.locals.site;

      if (!('user' in req.body)) return res.status(400).json({ error: true, statusCode: 404, message: 'No user data in query.' });

      let userID;

      if (typeof req.body.user === 'string') {
        userID = req.body.user;
      } else if (typeof req.body.user === 'object' && req.body.user.id) {
        userID = req.body.user.id
      }

      axios({
        method:'get',
        url:`https://discordapp.com/api/users/${userID}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bot BOT_TOKEN'
        },
        responseType:'JSON'
      }).then((body) => {
        const fetchedUser = body.data;
        const avatarFormat = fetchedUser.avatar && fetchedUser.avatar.startsWith('a_') ? 'gif' : 'png';

        const Message = new MessageEmbed()
          .setAuthor(site.name, site.icon)
          .setDescription(`:incoming_envelope: \`${fetchedUser.username}#${fetchedUser.discriminator}\` just [upvoted](https://${site.upvoteURL}) \`BOT_NAME\`.`)
          .setColor(0x7289DA)
          .setThumbnail(`https://cdn.discordapp.com/avatars/${fetchedUser.id}/${fetchedUser.avatar}.${avatarFormat}?size=512`)
          .setFooter(site.name, `https://cdn.discordapp.com/avatars/${fetchedUser.id}/${fetchedUser.avatar}.${avatarFormat}?size=512`)
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