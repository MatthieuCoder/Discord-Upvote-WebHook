const { get } = require('axios');
const Route = require('../Base/route');
const { WebhookClient, MessageEmbed } = require('../utils');

class Hook extends Route {
	constructor(parent) {
		super({
			path: '/webhook'
		});

		Object.assign(this, parent);

		this.webhook = new WebhookClient(this.config.webhook.id, this.config.webhook.token);

		this.setupRoutes();
	}

	setupRoutes() {
		this.router.post('/:path', (req, res) => {
			const site = this.config.lists.find((list) => list.path === `/${req.params.path}`);

			if (!site) return res.status(404).json({ error: true, statusCode: 404, message: 'An invalid PATH was provided.' });

			if (!req.get('Authorization') || req.get('Authorization') !== site.token) return res.status(401).json({ error: true, statusCode: 401, message: 'An invalid Authorization token was provided.' });

			if (!('user' in req.body)) return res.status(400).json({ error: true, statusCode: 404, message: 'No user data in query.' });

			let userID;

			if (typeof req.body.user === 'string') userID = req.body.user;
			else if (typeof req.body.user === 'object' && req.body.user.id) userID = req.body.user.id

			get(`https://discordapp.com/api/users/${userID}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bot ${this.config.bot.token}`
				},
				responseType:'JSON'
			}).then((body) => {
				const fetchedUser = body.data;
				const avatarFormat = fetchedUser.avatar && fetchedUser.avatar.startsWith('a_') ? 'gif' : 'png';

				const Message = new MessageEmbed()
					.setAuthor(site.name, site.icon)
					.setDescription(`:incoming_envelope: \`${fetchedUser.username}#${fetchedUser.discriminator}\` just [upvoted](https://${site.upvoteURL}) \`${this.config.bot.name}\`.`)
					.setColor(0x7289DA)
					.setThumbnail(`https://cdn.discordapp.com/avatars/${fetchedUser.id}/${fetchedUser.avatar}.${avatarFormat}?size=512`)
					.setFooter(site.name, `https://cdn.discordapp.com/avatars/${fetchedUser.id}/${fetchedUser.avatar}.${avatarFormat}?size=512`)
					.setTimestamp();

				this.webhook.send(null, this.config.webhook.name, this.config.webhook.avatar, Message.embed).then(() => {
					return res.status(200).json({ error: false, statusCode: 200, message: 'Successfully sent to Discord.' });
				});
			}).catch(async (error) => {
				if (error.statusCode === 404) {
					res.status(404).json({ error: true, statusCode: 404, message: 'The user ID submitted does not exist on Discord', stack: error.stack });
					this.utils.logger.error({ error: true, statusCode: 404, message: 'The user ID submitted does not exist on Discord', stack: error.stack });
				} else {
					res.status(500).json({ error: true, statusCode: 500, message: 'Something went wrong while performing the request', stack: error.stack });
					this.utils.logger.error({ error: true, statusCode: 500, message: 'FSomething went wrong while performing the request', stack: error.stack });
				}
			});
		})
	}
}

module.exports = Hook;
