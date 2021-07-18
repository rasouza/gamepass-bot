import { readFileSync } from 'fs'
import { Message, TextChannel } from 'discord.js'
import SubscriptionDB from '../models/subscription.js'

const { username } = JSON.parse(readFileSync('../config/settings.json', 'utf8'))

const db = new SubscriptionDB()

export default {
  name: 'unsubscribe',
  description: 'Unsubscribe channel for Gamepass news',
  async execute (message: Message): Promise<void> {
    const webhooks = await (message.channel as TextChannel).fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name === username)
    if (!webhook) return

    db.delete(webhook.id)
    webhook.delete()

    message.reply('This channel is unsubscribed from Game Pass news')
  }
}
