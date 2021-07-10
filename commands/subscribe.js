const { username, avatarURL } = require('../config/settings.json')
const Logger = require('../config/logger')
const db = require('../services/supabase')

module.exports = {
  name: 'subscribe',
  description: 'Subscribe channel for Gamepass news',
  async execute(message, args) {
    const webhooks = await message.channel.fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name ===  username)
    if (webhook) {
      message.reply('This channel is already subscribed.')
    } else {
      const webhook = await message.channel.createWebhook(username, { avatar: avatarURL })
      await db.newSubscription(message.channel.id, webhook.id)
      message.reply('Channel subscribed successfully! I\'m posting here whenever a new game is out on Game Pass.')
    }
  }
}