import { Collection, Message, TextChannel, Webhook } from 'discord.js'
import { username, avatarURL } from '../config/settings.json'
import { deleteSubscription } from '../services/supabase'

export default {
  name: 'unsubscribe',
  description: 'Unsubscribe channel for Gamepass news',
  async execute(message: Message, args: string[]) {
    const webhooks: Collection<string, Webhook> = await (message.channel as TextChannel).fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name ===  username)
    if (webhook) {
      webhook.delete()
      deleteSubscription(webhook.channelID)
      message.reply('This channel is unsubscribed from Game Pass news')
    } else {
      message.reply('This channel is not subscribed on any news')
    }
  }
}