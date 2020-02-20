# Discord Upvote WebHook
This web server is a simple WebHook receiver to catch users' votes coming from bots lists related to Discord, such as `Top.gg`.

[![CodeFactor](https://www.codefactor.io/repository/github/sfalltech/discord-upvote-webhook/badge)](https://www.codefactor.io/repository/github/sfalltech/discord-upvote-webhook)
[![Discord Server](https://discordapp.com/api/guilds/438860643685367809/embed.png)](https://discord.gg/xg4kXd2)
[![Donate on PayPal](https://img.shields.io/badge/paypal-donate-blue.svg)](https://paypal.me/unixcorp)

# Table of Contents
- [How to use](#How-to-use)

- [How to launch](#How-to-launch)

# How to use

- First, install all NPM packages needed by executing the command `npm i` in your console while being in the project directory.

- Rename `./config.example.js` file to `./config.js`, and set all values needed.

```
webhook: {
  id: '', // Discord WebHook ID
  avatar: '', // An image URL to set the WebHook's avatar on Discord
  name: '', // A desired name for the WebHook
  token: '' // Discord WebHook token
}
```

To have the WebHook ID and its token copy the URL given on the WebHook panel

`https://discordapp.com/api/webhooks/` => base URL, `675798965194719293` => WebHook ID /`atNAWg0yjstTvGAFI_FaGGLYRfRGX2I-B5Tk4T8GIouBC_VJXx5mEkJPXg23e8VXdIIO` => WebHook token

- Add a bot list to the configuration by adding an object containing all information needed, especially the PATH, the token and the name

```
{
  name: 'Top.gg | Discord Bot List', // A desired name for the Embed
  path: '/dbl', // A desired path
  token: '', // Add your API token given by the bots list
  upvoteURL: 'top.gg/bot/BotID/vote', // Replace 'BotID' by your bot's ID
  icon: 'https://top.gg/images/dblnew.png' // A desired icon of the website
}
```

- In the `./src/routes/hook.js` file replace "BOT_TOKEN" (line 33) by your bot's token, and "BOT_NAME" (line 40) by your bot's name

# How to launch

- If you are not using PM2 run the command `npm run start` to launch the web server with Node.js. The server will run on port 5000 (This can be changed in the configuration file).
- If you are using PM2 run the command `npm run start:staging` to launch the web server with PM2. The server will run on port 5000 (This can be changed in the configuration file).

The server will be available at this adress https://host:5000/.

In the parameters of your bot, available on the site of the list insert this link followed by the chosen PATH for the request to be posted there.
> `URL example:` https://host:5000/webhook/dbl for Discord Bot List (Top.gg)