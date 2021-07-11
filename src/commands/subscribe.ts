import { Collection, Message, TextChannel, Webhook } from 'discord.js'
import { username, avatarURL } from '../config/settings.json'
import { newSubscription } from '../services/supabase'

export default {
  name: 'subscribe',
  description: 'Subscribe channel for Gamepass news',
  async execute(message: Message, args: string[]) {
    const webhooks: Collection<string,Webhook> = await (message.channel as TextChannel).fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name ===  username)
    if (webhook) {
      message.reply('This channel is already subscribed.')
    } else {
      const webhook = await (message.channel as TextChannel).createWebhook(username, { avatar: avatarURL })
      await newSubscription(webhook.channelID, webhook.id)
      message.reply('Channel subscribed successfully! I\'m posting here whenever a new game is out on Game Pass.')
    }
  }
}