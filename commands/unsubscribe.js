const { username, avatarURL } = require('../config/settings.json')
const Logger = require('../config/logger')
const db = require('../services/supabase')

module.exports = {
  name: 'unsubscribe',
  description: 'Unsubscribe channel for Gamepass news',
  async execute(message, args) {
    const webhooks = await message.channel.fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name ===  username)
    if (webhook) {
      webhook.delete()
      db.deleteSubscription(webhook.channelID)
      message.reply('This channel is unsubscribed from Game Pass news')
    } else {
      message.reply('This channel is not subscribed on any news')
    }
  }
}