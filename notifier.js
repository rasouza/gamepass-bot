require('dotenv').config();

const { Client } = require('discord.js');
const discord = require('./services/discord')
const db = require('./services/supabase')
const Logger = require('./config/logger')

const client = new Client();
client.login(process.env.DISCORD_TOKEN)

process.on('unhandledRejection', (error,) => {
  Logger.error(error);
});

client.once('ready', async () => {
  Logger.info('Notifier started!')
  const subscriptions = await db.getSubscriptions()
  const webhooks = await Promise.all(subscriptions.map(sub => client.fetchWebhook(sub.webhook)))

  db.onInsert(payload => {
    const game = discord.gameEmbed(payload.new)
    discord.broadcast(webhooks, 'A new game has arrived!', game)
  })
})
